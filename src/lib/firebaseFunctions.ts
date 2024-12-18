import { db } from "@/firebaseConfig";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";

const todosCollection = collection(db, "todos");

export async function addTodoToFirestore(title: string, uid: string) {
    await addDoc(todosCollection, { title, completed: false, uid });
}

export async function fetchTodosFromFirestore(uid: string) {
    const q = query(todosCollection, where("uid", "==", uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function toggleTodoInFirestore(id: string, completed: boolean) {
    const todoDoc = doc(db, "todos", id);
    await updateDoc(todoDoc, { completed: !completed });
}

export async function removeTodoFromFirestore(id: string) {
    const todoDoc = doc(db, "todos", id);
    await deleteDoc(todoDoc);
}

export function subscribeToTodos(uid: string, callback: (todos: any[]) => void) {
    const q = query(todosCollection, where("uid", "==", uid));
    return onSnapshot(q, (snapshot) => {
        const todos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(todos);
    });
}
