import { eq, and, desc } from 'drizzle-orm';
import { db } from './index.ts';
import { users, reframedCards, characterState } from './schema.ts';
import { ReframedCard, CharacterState } from '../types.ts';

export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName?: string | null,
  photoUrl?: string | null
) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
        photoUrl: photoUrl || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || null,
          photoUrl: photoUrl || null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('getOrCreateUser error:', error);
    throw new Error('Failed to register or sync user.', { cause: error });
  }
}

export async function getUserCards(uid: string): Promise<ReframedCard[]> {
  try {
    const rows = await db
      .select()
      .from(reframedCards)
      .where(eq(reframedCards.userId, uid))
      .orderBy(desc(reframedCards.createdAt));

    return rows.map((row) => ({
      id: row.id,
      originalText: row.originalText,
      mainReframedKeyword: row.mainReframedKeyword,
      strengths: JSON.parse(row.strengths || '[]'),
      situationalExamples: JSON.parse(row.situationalExamples || '[]'),
      selfCompassionMessage: row.selfCompassionMessage,
      affirmation: row.affirmation,
      actionAdvice: row.actionAdvice,
      categoryTag: row.categoryTag,
      timestamp: row.timestamp,
      moodBefore: row.moodBefore ?? undefined,
      moodAfter: row.moodAfter ?? undefined,
      isFavorite: row.isFavorite,
      notes: row.notes ?? undefined,
    }));
  } catch (error) {
    console.error('getUserCards error:', error);
    throw new Error('Failed to fetch user reframed cards.', { cause: error });
  }
}

export async function upsertUserCard(uid: string, card: ReframedCard): Promise<void> {
  try {
    await db
      .insert(reframedCards)
      .values({
        id: card.id,
        userId: uid,
        originalText: card.originalText,
        mainReframedKeyword: card.mainReframedKeyword,
        strengths: JSON.stringify(card.strengths || []),
        situationalExamples: JSON.stringify(card.situationalExamples || []),
        selfCompassionMessage: card.selfCompassionMessage,
        affirmation: card.affirmation,
        actionAdvice: card.actionAdvice,
        categoryTag: card.categoryTag,
        timestamp: card.timestamp,
        moodBefore: card.moodBefore ?? null,
        moodAfter: card.moodAfter ?? null,
        isFavorite: !!card.isFavorite,
        notes: card.notes ?? null,
      })
      .onConflictDoUpdate({
        target: reframedCards.id,
        set: {
          originalText: card.originalText,
          mainReframedKeyword: card.mainReframedKeyword,
          strengths: JSON.stringify(card.strengths || []),
          situationalExamples: JSON.stringify(card.situationalExamples || []),
          selfCompassionMessage: card.selfCompassionMessage,
          affirmation: card.affirmation,
          actionAdvice: card.actionAdvice,
          categoryTag: card.categoryTag,
          timestamp: card.timestamp,
          moodBefore: card.moodBefore ?? null,
          moodAfter: card.moodAfter ?? null,
          isFavorite: !!card.isFavorite,
          notes: card.notes ?? null,
        },
      });
  } catch (error) {
    console.error('upsertUserCard error:', error);
    throw new Error('Failed to save card.', { cause: error });
  }
}

export async function deleteUserCard(uid: string, cardId: string): Promise<void> {
  try {
    await db
      .delete(reframedCards)
      .where(and(eq(reframedCards.userId, uid), eq(reframedCards.id, cardId)));
  } catch (error) {
    console.error('deleteUserCard error:', error);
    throw new Error('Failed to delete card.', { cause: error });
  }
}

export async function getUserCharacterState(uid: string): Promise<CharacterState | null> {
  try {
    const rows = await db
      .select()
      .from(characterState)
      .where(eq(characterState.userId, uid));

    if (!rows.length) return null;

    const row = rows[0];
    return {
      name: row.name,
      level: row.level,
      exp: row.exp,
      points: row.points,
      streakDays: row.streakDays,
      lastLoginDate: row.lastLoginDate || '',
      equipped: JSON.parse(row.equipped || '{}'),
      unlockedItemIds: JSON.parse(row.unlockedItemIds || '[]'),
    };
  } catch (error) {
    console.error('getUserCharacterState error:', error);
    throw new Error('Failed to fetch character state.', { cause: error });
  }
}

export async function upsertUserCharacterState(
  uid: string,
  state: CharacterState
): Promise<void> {
  try {
    await db
      .insert(characterState)
      .values({
        userId: uid,
        name: state.name,
        level: state.level,
        exp: state.exp,
        points: state.points,
        streakDays: state.streakDays,
        lastLoginDate: state.lastLoginDate,
        equipped: JSON.stringify(state.equipped || {}),
        unlockedItemIds: JSON.stringify(state.unlockedItemIds || []),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: characterState.userId,
        set: {
          name: state.name,
          level: state.level,
          exp: state.exp,
          points: state.points,
          streakDays: state.streakDays,
          lastLoginDate: state.lastLoginDate,
          equipped: JSON.stringify(state.equipped || {}),
          unlockedItemIds: JSON.stringify(state.unlockedItemIds || []),
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    console.error('upsertUserCharacterState error:', error);
    throw new Error('Failed to save character state.', { cause: error });
  }
}
