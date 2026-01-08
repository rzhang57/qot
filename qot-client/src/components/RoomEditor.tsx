import { HubsClient } from "../services/HubsClient.ts";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function RoomEditor() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isRemoteUpdate = useRef(false);

    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Start typing...</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base focus:outline-none min-h-screen p-8',
            },
        },
        onUpdate: ({ editor }) => {
            if (!isRemoteUpdate.current) {
                const markdown = editor.getHTML();
                HubsClient.sendMarkdownUpdate(id as string, markdown);
            }
            isRemoteUpdate.current = false;
        },
    });

    // Verify user is in room
    useEffect(() => {
        if (!HubsClient.isInRoom(id as string)) {
            navigate(`/rooms/${id}`);
        }
    }, [id, navigate]);

    // Listen for updates from other users
    useEffect(() => {
        HubsClient.onMarkdownUpdated((updatedContent: string) => {
            if (editor && editor.getHTML() !== updatedContent) {
                isRemoteUpdate.current = true;
                editor.commands.setContent(updatedContent, { emitUpdate: false });
            }
        });
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <EditorContent editor={editor} />
        </div>
    );
}