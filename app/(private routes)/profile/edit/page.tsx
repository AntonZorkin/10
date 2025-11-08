import { getCurrentUser } from '@/lib/api/serverApi';
import EditProfileForm from '@/components/EditProfileForm/EditProfileForm';

export default async function EditProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return <EditProfileForm initialUser={user} />;
}
