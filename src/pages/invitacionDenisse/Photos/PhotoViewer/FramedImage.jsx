export default function FramedImage({ src, index, alt, addFrame }) {
  const [current, setCurrent] = useState(null);
  const [next, setNext] = useState(null);
  const fromLeft = index % 2 === 0;

  useEffect(() => {
    let alive = true;

    addFrame(src).then((img) => {
      if (alive) {
        setNext(img);
      }
    });

    return () => (alive = false);
  }, [src]);

  useEffect(() => {
    if (next) {
      setCurrent(next);
      setNext(null);
    }
  }, [next]);

  return (
    <AnimatePresence mode="wait">
      {current && (
        <motion.img
          key={current}
          src={current}
          alt={alt}
          className="session-photo"
          initial={{ opacity: 0, x: fromLeft ? -60 : 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 2 }}
        />
      )}
    </AnimatePresence>
  );
}
