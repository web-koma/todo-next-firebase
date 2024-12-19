import { db } from "@/firebaseConfig";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";

const todosCollection = collection(db, "todos");

// ユーザーごとのTodoを追加
export async function addTodoToFirestore(title: string, uid: string) {
    await addDoc(todosCollection, { title, completed: false, uid }); // uidを追加
}

// ユーザーごとのTodoを取得（リアルタイム）
export function subscribeToTodos(
    uid: string,
    callback: (todos: { id: string; title: string; completed: boolean; uid: string }[]) => void
) {
    const q = query(todosCollection, where("uid", "==", uid));
    return onSnapshot(q, (snapshot) => {
        const todos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as { title: string; completed: boolean; uid: string }), // 型キャストを追加
        }));
        callback(todos);
    });
}

// Todoの完了状態を切り替え
export async function toggleTodoInFirestore(id: string, completed: boolean) {
    const todoDoc = doc(db, "todos", id);
    await updateDoc(todoDoc, { completed: !completed });
}

// Todoを削除
export async function removeTodoFromFirestore(id: string) {
    const todoDoc = doc(db, "todos", id);
    await deleteDoc(todoDoc);
}
