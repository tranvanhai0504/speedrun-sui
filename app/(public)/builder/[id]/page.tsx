import BuilderProfileView from "@/components/builder/BuilderProfileView";

export default async function BuilderPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <BuilderProfileView id={id} />;
}
