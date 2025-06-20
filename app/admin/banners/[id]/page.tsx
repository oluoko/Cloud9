import prisma from "@/utils/db";
import { notFound } from "next/navigation";
import { EditBannerForm } from "../../_components/EditBannerForm";

export default async function EditBanner({
  params,
}: {
  params: { id: string };
}) {
  const banner = await prisma.banner.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!banner) return notFound();

  return <EditBannerForm data={banner} />;
}
