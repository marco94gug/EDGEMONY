import styles from "./index.module.scss";
import { useEffect, useState, memo, useContext } from "react";
import { GET } from "../../utils/api";
import { BASE_URL_IMG } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { reducerData } from "../../pages/_app";

export default memo(function MainModal({
  // movieID,
  // setModalVisibility,
  category,
}) {
  const [open, setOpen] = useState("");
  const [movieData, setMovieData] = useState({});
  const [videoData, setVideoData] = useState({});

  // const { state } = useContext(reducerData);

  // console.log(data);
  const dispatch = useDispatch();
  const { movieSetup } = useSelector((state) => state);

  const handleOnClickClose = () => {
    dispatch({ type: "SET_MODAL_INACTIVE" });
  };

  const handleOnBackgroundClick = () => {
    dispatch({ type: "SET_MODAL_INACTIVE" });
  };

  useEffect(() => {
    GET(category, movieSetup.movieID).then((data) => {
      setMovieData(data);
    });
  }, [movieSetup.movieID, category]);

  useEffect(() => {
    GET(category, `${movieSetup.movieID}/videos`, "&language=en-US").then(
      (dataMovie) => {
        setVideoData(dataMovie?.results[0]);
      }
    );
  }, [movieSetup.movieID, category]);

  useEffect(() => {
    setOpen("open");
  }, []);

  return (
    <div className={styles.MainModal + " " + styles[open]}>
      <div
        onClick={handleOnBackgroundClick}
        className={styles.backdrop_overlay}
      />
      <div className={styles.MainModal__container}>
        <div className={styles.img_container}>
          <img src={BASE_URL_IMG + movieData.poster_path} alt="poster" />
        </div>
        <div
          className={styles.MainModal__container_background}
          style={{
            backgroundImage: `url("https://image.tmdb.org/t/p/original/${movieData.backdrop_path}")`,
          }}
        />
        <div className={styles.MainModal__container_background_overlay} />
        <div className={styles.MainModal__container_background_halfoverlay} />
        <div className={styles.MainModal__info}>
          <div className={styles.MainModal__info_container_title}>
            <h2 className={styles.MainModal__info_title}>{movieData.title}</h2>
            <p className={styles.MainModal__tagline}>{movieData.tagline}</p>
          </div>
          <ul className={styles.MainModal__info_genres}>
            {movieData.genres &&
              movieData.genres.map((item, index) => (
                <li key={index}>{item.name}</li>
              ))}
          </ul>
          <p className={styles.MainModal__description}>{movieData.overview}</p>
          <p className={styles.release}>
            {movieData.release_date
              ? movieData.release_date
              : movieData.first_air_date}
          </p>
          {videoData?.key && (
            <iframe
              className={styles.movie}
              src={`https://www.youtube.com/embed/${videoData.key}?autoplay=1&controls=1&disablekb=1&fs=0&mute=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
        <div onClick={handleOnClickClose} className={styles.close}>
          X
        </div>
      </div>
    </div>
  );
});
