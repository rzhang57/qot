import { HubsClient } from "../services/HubsClient.ts";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {RoomsClient} from "../services/RoomsClient.ts";

export default function RoomEditor() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isRemoteUpdate = useRef(false);

    const editor = useEditor({
        extensions: [StarterKit],
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

    useEffect(() => {
        if (!HubsClient.isInRoom(id as string)) {
            navigate(`/rooms/${id}`);
        }
    }, [id, navigate]);

    useEffect(() => {
        const loadRoom = async () => {
            try {
                const room = await RoomsClient.findRoom(id as string);
                if (editor) {
                    editor.commands.setContent(room.markdownContent || '<p>Start typing...</p>', {
                        emitUpdate: false
                    });
                }
            } catch (err) {
                console.error('Failed to load room:', err);
            }
        };

        if (editor) {
            loadRoom();
        }
    }, [editor, id]);

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
        <div className="min-h-screen bg-[#FAFAFA] flex justify-center">
            <div className="w-full max-w-3xl p-8">
                <EditorContent editor={editor}/>
            </div>
        </div>
    );
}