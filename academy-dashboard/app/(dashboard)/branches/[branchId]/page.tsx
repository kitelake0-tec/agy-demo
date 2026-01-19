
import BranchDetailClient from "./BranchDetailClient";

export async function generateStaticParams() {
    return [
        { branchId: '1' },
        { branchId: '2' },
        { branchId: '3' },
        { branchId: '4' },
        { branchId: '5' },
    ];
}

export default async function BranchDetailPage({ params }: { params: Promise<{ branchId: string }> }) {
    const { branchId } = await params;
    return <BranchDetailClient branchId={branchId} />;
}
