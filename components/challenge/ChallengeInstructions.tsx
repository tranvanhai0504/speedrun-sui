import ReactMarkdown from "react-markdown";

interface ChallengeInstructionsProps {
    instructions: string | null;
}

export function ChallengeInstructions({ instructions }: ChallengeInstructionsProps) {
    return (
        <div className="bg-white p-8 md:p-12 rounded-[2rem] border-2 border-[#0F2854] shadow-[8px_8px_0px_0px_#0F2854]">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:text-[#0F2854] prose-p:text-[#0F2854]/90 prose-pre:border-2 prose-pre:border-[#0F2854] prose-pre:shadow-[4px_4px_0px_0px_#0F2854]">
                {instructions ? (
                    <ReactMarkdown>{instructions}</ReactMarkdown>
                ) : (
                    <p className="italic text-gray-500">No instructions provided for this challenge yet.</p>
                )}
            </div>
        </div>
    );
}
