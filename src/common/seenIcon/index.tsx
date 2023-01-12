import { CheckOutlined } from "@ant-design/icons";

const DoubleCheck = ({
  color = "#000000",
  single = false,
}: {
  color?: string;
  single?: boolean;
}) => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ zIndex: 1 }}>
        <CheckOutlined style={{ color }} />
      </div>
      {!single && (
        <div style={{ zIndex: 2, marginLeft: -10 }}>
          <CheckOutlined style={{ color }} />
        </div>
      )}
    </div>
  );
};

export default DoubleCheck;
