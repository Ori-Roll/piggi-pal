import { PropsWithChildren, useEffect } from 'react';
import { useSpring, animated, to as interpolate } from '@react-spring/web';

type AnimatedShakeProps = PropsWithChildren<{
  delay?: number;
}>;

const AnimatedShake = (props: AnimatedShakeProps) => {
  const { children } = props;

  const [{ x, y, rotateX, rotateY, rotateZ, zoom, scale }, api] = useSpring(
    () => ({
      rotateX: 0,
      rotateY: 0,
      rotateZ: Math.random() * 10 + 5,
      scale: 0,
      zoom: Math.random() * 0.5 + 1,
      x: 0,
      y: 0,
      config: { mass: 5, tension: 350, friction: 40 },
    })
  );

  useEffect(() => {
    api.start({
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 0,
      zoom: 1,
      x: 0,
      y: 0,
      delay: props.delay || 0,
    });
  }, [api]);

  return (
    <animated.div
      style={{
        width: 'fit-content',
        height: 'fit-content',
        transform: 'perspective(600px)',
        x,
        y,
        scale: interpolate([scale, zoom], (s, z) => s + z),
        rotateX,
        rotateY,
        rotateZ,
      }}
    >
      {children}
    </animated.div>
  );
};

export default AnimatedShake;
