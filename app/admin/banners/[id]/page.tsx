import prisma from "@/utils/db";
import { EditBannerForm } from "../../_components/edit-banner-form";
import AppNotFoundPage from "@/app/not-found";

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

  if (!banner) return <AppNotFoundPage />;

  return <EditBannerForm data={banner} />;
}
