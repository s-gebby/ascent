import { ref, set, get, update, remove, push } from "firebase/database";

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
  return update(ref(database, `users/${userId}/goals/${goalId}`), updates);
};
