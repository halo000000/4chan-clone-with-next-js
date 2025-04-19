import GroupPage from '@/components/GroupPage';

interface Props {
  params: { groupId: string }
}

export default function Group({params}: Props) {
  const groupId = params.groupId;

  // Mock group data, replace with actual data fetching later
  const group = {
    id: groupId,
    name: `Group ${groupId}`,
    description: `Description for Group ${groupId}`,
  };

  return (
    <GroupPage group={group}/>
  );
}
