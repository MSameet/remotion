import ReactConfetti from "react-confetti";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const MyAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing for the animation
  const expandStart = 30; // Frame when expansion starts
  const expandDuration = 60; // Duration of the expansion
  const numbersStart = expandStart + 30;
  const textStart = numbersStart + 20; // Text starts after numbers are revealed

  // Spring animation for the circle expansion
  const expandProgress = spring({
    frame: frame - expandStart,
    fps,
    config: {
      damping: 10,
      mass: 1,
    },
  });

  // Interpolation for expanding the circle
  const width = interpolate(expandProgress, [0, 1], [200, 500], {
    extrapolateRight: "clamp",
  });

  // Ensure the circle stays expanded after the animation ends
  const finalWidth = frame >= expandStart + expandDuration ? 500 : width;

  // Interpolation for number increase
  const numberValue = interpolate(
    frame,
    [numbersStart, numbersStart + 30],
    [0, 1300],
    {
      extrapolateRight: "clamp",
    }
  );

  // Ensure the number stays at 1300 after the animation ends
  const finalNumberValue =
    frame >= numbersStart + 30 ? 1300 : Math.round(numberValue);

  // Interpolation for text sliding up
  const textTranslateY = interpolate(
    frame,
    [textStart, textStart + 20],
    [0, -100],
    {
      extrapolateRight: "clamp",
    }
  );

  // Ensure the text stays in place after the animation ends
  const finalTextTranslateY =
    frame >= numbersStart + 30 ? -150 : textTranslateY;
  const opacity = interpolate(frame, [textStart, textStart + 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div className="flex justify-center items-center flex-1">
      <div
        className="bg-black rounded-[100px] flex items-center  font-bold h-[200px] relative "
        style={{
          width: `${finalWidth}px`,
        }}
      >
        <div className="bg-gray-600 rounded-full flex items-center justify-center h-[200px] aspect-square text-[100px]">
          😊
        </div>
        {/* Numbers */}
        {frame > numbersStart && (
          <span className="ml-5 text-5xl text-white font-bold z-50">
            +{finalNumberValue}
          </span>
        )}
        {frame > numbersStart && (
          <div
            className="text-5xl text-black duration-500 absolute w-fit z-10"
            style={{
              top: "0%",
              left: "50%",
              opacity,
              transform: `translateX(-50%) translateY(${finalTextTranslateY}%)`,
            }}
          >
            Followers
          </div>
        )}
        {frame > textStart && (
          <ReactConfetti
            className="text-5xl text-black duration-500 absolute w-fit z-10"
            style={{
              top: "50%",
              left: "50%",
              opacity,
              transform: `translateX(-50%) translateY(-50%)`,
            }}
            drawShape={(ctx) => {
              ctx.beginPath();
              for (let i = 0; i < 22; i++) {
                const angle = 0.35 * i;
                const x = (0.2 + 1.5 * angle) * Math.cos(angle);
                const y = (0.2 + 1.5 * angle) * Math.sin(angle);
                ctx.lineTo(x, y);
              }
              ctx.stroke();
              ctx.closePath();
            }}
          />
        )}
      </div>
    </div>
  );
};
