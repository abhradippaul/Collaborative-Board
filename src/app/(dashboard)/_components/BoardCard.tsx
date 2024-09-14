interface Props {
  id?: string | null;
  name?: string | null;
  image?: string | null;
}
function BoardCard({ image, id, name }: Props) {
  return <div>BoardCard</div>;
}

export default BoardCard;
