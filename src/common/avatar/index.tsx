import Styles from "./avatar.module.css";

const AvatarComponent = ({
  image,
  active = false,
}: {
  image?: string;
  active?: boolean;
}) => {
  return (
    <div className={Styles.avatar}>
      <div className={Styles.avatarImg}>
        <img
          src={image}
          alt='#'
          style={{ height: 40, width: 40, borderRadius: 40 }}
        />
        <div className={active ? Styles.status : ""} />
      </div>
    </div>
  );
};

export default AvatarComponent;
