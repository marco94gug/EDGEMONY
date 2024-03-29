import styles from "./index.module.scss";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";
import { VscChromeClose } from "react-icons/vsc";
import { useState, useRef, useEffect, memo } from "react";
import { GET } from "../../utils/api";
import Logo from "./Logo";
// import ResultsSection from "../ResultsSection";

export default memo(function NavBar({ setMovieID, setModalVisibility }) {
  const categoryRef = useRef(null);
  const searchInput = useRef(null);
  const overlay = useRef(null);
  const categoryList = useRef(null);

  const [isActive, setIsActive] = useState(false);
  const [menuIsActive, setMenuIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [results, setResults] = useState({ results: [] });
  const [isSerchActive, setSearchActive] = useState(false);
  const [typeofGenres, setTypeOfGenres] = useState("movie");
  const [genreList, setGenreList] = useState([{ id: "", name: "" }]);
  const [genreID, setGenreID] = useState("");
  const [movieList, setMovieList] = useState({
    results: [{ title: "", poster_path: "", overview: "" }],
  });

  const handleOnClick = () => {
    setIsActive(true);
    searchInput.current.focus();
  };

  const browseClick = () => {
    if (menuIsActive) {
      setMenuIsActive(false);
    } else {
      setMenuIsActive(true);
    }
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    console.log(results);
  };

  const onInputSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSearchActive(true);
  };

  const handleOnCloseClick = () => {
    setIsActive(false);
    setSearchActive(false);
    setSearchQuery("");
  };

  const handleOnMouseEnter = (e) => {
    e.target.classList.add(styles.category_hover);
    categoryList.current.classList.add(styles.hover);
  };

  const handleOnMouseLeave = (e) => {
    e.target.classList.remove(styles.category_hover);
    categoryList.current.classList.remove(styles.hover);
  };

  const handleOnClickLink = (id) => {
    setMovieID(id);
    setModalVisibility(true);
  };

  const handleOnTypeOfGenreClick = (e) => {
    setTypeOfGenres(e.target.id);
  };

  const handleOnGenreClick = (id) => {
    setGenreID(id);
  };

  useEffect(() => {
    const overlayNode = overlay.current;

    const handleEventListener = (e) => {
      if (
        e.target.id !== "main_search" &&
        e.target.tagName !== "path" &&
        e.target.tagName !== "svg" &&
        e.target.id !== "results"
      ) {
        setIsActive(false);
        setSearchActive(false);
        setSearchQuery("");
      }
    };
    const handleOverlayClick = () => {
      setMenuIsActive(false);
    };

    window.addEventListener("click", handleEventListener);
    overlayNode.addEventListener("click", handleOverlayClick);
  }, []);

  useEffect(() => {
    searchQuery.length > 1 &&
      GET(
        "search",
        "movie",
        `&query=${searchQuery}&page=1&include_adult=false`
      ).then((data) => {
        setResults(data);
      });
  }, [searchQuery]);

  useEffect(() => {
    searchQuery.length === 0 && setSearchActive(false);
    isActive
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto");
  }, [searchQuery, isActive]);

  useEffect(() => {
    GET("genre", `${typeofGenres}/list`).then((data) =>
      setGenreList(data.genres)
    );
  }, [typeofGenres]);

  useEffect(() => {
    GET(
      "discover",
      `${typeofGenres}`,
      `&language=en-US&sort_by=popularity.desc&include_adult=false&page=${pageNumber}&with_genres=${genreID}&with_watch_monetization_types=flatrate`
    )
      .then((data) => setMovieList(data))
      .then(console.log(movieList));
  }, [genreID, typeofGenres, pageNumber, movieList]);

  return (
    <div className={styles.NavBar}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <h3
        onClick={browseClick}
        className={`${styles.browse_btn} ${menuIsActive && styles.active}`}
      >
        Browse <IoMdArrowDropdown className={styles.arrow} />
      </h3>
      <ul className={`${styles.NavBar__link} ${menuIsActive && styles.active}`}>
        <li>Home</li>
        <li
          onMouseOver={(e) => handleOnMouseEnter(e)}
          onMouseOut={(e) => handleOnMouseLeave(e)}
          ref={categoryRef}
        >
          <div ref={categoryList} className={styles.category_list}>
            <div className={styles.content}>
              <div className={styles.left_sider}>
                <div className={styles.list_container}>
                  <h3>Top Categories</h3>
                  <ul>
                    <li onClick={(e) => handleOnTypeOfGenreClick(e)} id="movie">
                      Movies
                    </li>
                    <li onClick={(e) => handleOnTypeOfGenreClick(e)} id="tv">
                      TV
                    </li>
                  </ul>
                </div>
              </div>
              <div className={styles.right_sider}>
                <div className={styles.list_container}>
                  <h4>{typeofGenres} Genres</h4>
                  <ul>
                    {genreList.map((genre, index) => (
                      <li
                        onClick={() => handleOnGenreClick(genre.id)}
                        id={genre.id}
                        key={index}
                      >
                        {genre.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          Category <IoMdArrowDropdown className={styles.arrow} />
        </li>
        <li>My Stuff</li>
        <li>About us</li>
      </ul>

      <div
        ref={overlay}
        className={`${styles.overlay} ${menuIsActive && styles.active}`}
      />
      <form
        onSubmit={onSearchSubmit}
        className={`${styles.NavBar__searchbar_container} ${
          isActive && styles.active
        }`}
      >
        <VscChromeClose
          onClick={handleOnCloseClick}
          className={`${styles.close_bar} ${isActive && styles.active}`}
        />
        <AiOutlineSearch
          onClick={handleOnClick}
          className={`${styles.search_icon} ${isActive && styles.active}`}
        />
        <input
          ref={searchInput}
          type="text"
          id="main_search"
          onChange={onInputSearchChange}
          value={searchQuery}
          className={`${styles.NavBar__searchbar} ${isActive && styles.active}`}
          placeholder="Search"
        />
        <div
          id="results"
          className={
            isSerchActive
              ? styles.results_container + " " + styles.active
              : styles.results_container
          }
        >
          <ul>
            {results.results.map((item, index) => (
              <li onClick={() => handleOnClickLink(item.id)} key={index}>
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      </form>
      {/* <ResultsSection /> */}
    </div>
  );
});
