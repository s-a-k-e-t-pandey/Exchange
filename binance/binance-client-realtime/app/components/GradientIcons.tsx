
const GradientIcon = ({ Icon }: { Icon: React.ElementType }) => {
  return (
    <svg width="50" height="50">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="100%" x2="80%" y2="10%">
          <stop offset="0%" stopColor="#b44b38 " />
          <stop offset="10%" stopColor="#51aaec " />
          <stop offset="65%" stopColor="#ecf37d " />
          <stop offset="100%" stopColor="#9b8bdc " />
        </linearGradient>
      </defs>
      <Icon strokeWidth={5} stroke="url(#gradient)" fill="none" width="70%" height="100%" />
    </svg>
  );
};


export default GradientIcon;
