import "./index.css";

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      {children}
    </div>
  );
};

export default Card;
