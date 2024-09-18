import { getDatabase, ref, set, get, update, remove, push, child } from "firebase/database";

import { database } from "../firebaseConfig";
export const writeUserData = (userId, name, email) => {
  set(ref(database, 'users/' + userId), {
    username: name,
    email: email,
  });
};

export const readUserData = async (userId) => {
  const snapshot = await get(ref(database, 'users/' + userId));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

export const updateUserData = (userId, updates) => {
  update(ref(database, 'users/' + userId), updates);
};

export const deleteUserData = (userId) => {
  remove(ref(database, 'users/' + userId));
};

export const createGoal = (userId, goalData) => {
  const newGoalKey = push(ref(database, `users/${userId}/goals`)).key;
  set(ref(database, `users/${userId}/goals/${newGoalKey}`), goalData);
  return newGoalKey;
};

export const readGoals = async (userId) => {
  const goalsRef = ref(database, `users/${userId}/goals`);
  try {
    const snapshot = await get(goalsRef);
    if (snapshot.exists()) {
      console.log("Goals data:", snapshot.val());
      return snapshot.val();
    } else {
      console.log("No goals found for user:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error reading goals:", error);
    throw error;
  }
};

export const deleteGoal = (userId, goalId) => {
  return remove(ref(database, `users/${userId}/goals/${goalId}`));
};

export const updateGoal = (userId, goalId, updates) => {
  if (updates.completed) {
    updates.completedAt = new Date().toISOString();
  }
  return update(ref(database, `users/${userId}/goals/${goalId}`), updates);
};

export const createCalendarEvent = async (userId, event) => {
  const db = getDatabase();
  const eventRef = ref(db, `users/${userId}/calendarEvents`);
  const newEventRef = push(eventRef);
  await set(newEventRef, event);
  return newEventRef.key;
};

export const readCalendarEvents = async (userId) => {
  const db = getDatabase();
  const eventsRef = ref(db, `users/${userId}/calendarEvents`);
  const snapshot = await get(eventsRef);
  return snapshot.val();
};

export const updateCalendarEvent = async (userId, eventId, updates) => {
  const db = getDatabase();
  const eventRef = ref(db, `users/${userId}/calendarEvents/${eventId}`);
  await update(eventRef, updates);
};

export const deleteCalendarEvent = async (userId, eventId) => {
  const db = getDatabase();
  const eventRef = ref(db, `users/${userId}/calendarEvents/${eventId}`);
  await remove(eventRef);
};
export const createPost = async (user, content) => {
  const db = getDatabase();
  const postRef = ref(db, 'posts');
  const newPostRef = push(postRef);
  
  await set(newPostRef, {
    authorId: user.uid,
    authorName: user.displayName || 'Anonymous',
    authorPhotoURL: user.photoURL || '',
    content,
    timestamp: Date.now(),
    encouragements: {}
  });
};
export const readPosts = async () => {
  const db = getDatabase();
  const postsRef = ref(db, 'posts');
  const snapshot = await get(postsRef);
  
  if (snapshot.exists()) {
    const posts = [];
    snapshot.forEach((childSnapshot) => {
      posts.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    return posts.sort((a, b) => b.timestamp - a.timestamp);
  }
  
  return [];
};

// Implement updatePost and deletePost functions similarly

export const encouragePost = async (postId, userId) => {
  const db = getDatabase();
  const encouragementRef = ref(db, `posts/${postId}/encouragements/${userId}`);
  await set(encouragementRef, true);
};

export const deletePost = (postId) => {
  return remove(ref(database, `posts/${postId}`));
};
