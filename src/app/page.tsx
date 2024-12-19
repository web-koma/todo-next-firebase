"use client";

import { useEffect, useState } from "react";
import { 
    subscribeToTodos,
    addTodoToFirestore,
    toggleTodoInFirestore,
    removeTodoFromFirestore,
} from "@/lib/firebaseFunctions";
import { signInWithPopup, signOut, User } from "firebase/auth"; // FirebaseのUser型をインポート
import { auth, googleProvider } from "@/firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";

interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<string>(""); 
    const [user, setUser] = useState<User | null>(null); // User型を指定

    // FirestoreからユーザーごとのTodoをリアルタイム取得
    useEffect(() => {
        if (user) {
            const unsubscribe = subscribeToTodos(user.uid, (fetchedTodos) => {
                setTodos(fetchedTodos as Todo[]);
            });
            return () => unsubscribe();
        } else {
            setTodos([]); // ログアウト時にリセット
        }
    }, [user]);

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setTodos([]); // ログアウト時にTodoをクリア
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleAddTodo = async () => {
        if (newTodo.trim() === "" || !user) return; // 空白チェック + ユーザー確認
        await addTodoToFirestore(newTodo, user.uid); // ユーザーIDを追加
        setNewTodo(""); // 入力欄をリセット
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Todo App</h1>

            {user ? (
                <div className="mb-4">
                    <p>Welcome, {user.displayName}!</p>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleLogin}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Login with Google
                </button>
            )}

            {user && (
                <>
                    <div className="mb-4 flex gap-2">
                        <input
                            type="text"
                            placeholder="Add a new todo..."
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            className="p-2 border rounded w-64"
                        />
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleAddTodo}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Add
                        </motion.button>
                    </div>

                    <ul className="w-64">
                        <AnimatePresence>
                            {todos.map((todo) => (
                                <motion.li
                                    key={todo.id}
                                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex justify-between items-center mb-2 p-2 border rounded"
                                >
                                    <motion.span
                                        whileHover={{ scale: 1.1 }}
                                        className={`cursor-pointer ${
                                            todo.completed ? "line-through text-gray-500" : ""
                                        }`}
                                        onClick={() => toggleTodoInFirestore(todo.id, todo.completed)}
                                    >
                                        {todo.title}
                                    </motion.span>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => removeTodoFromFirestore(todo.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Delete
                                    </motion.button>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                </>
            )}
        </main>
    );
}
