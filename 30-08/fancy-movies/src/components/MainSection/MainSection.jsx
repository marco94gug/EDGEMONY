import { useState, useEffect, memo } from 'react';
import { GET } from '../../utils/api'
import MainCard from '../MainCard';
import CardList from '../CardList/CardList';
import './index.scss';
import loader from '../../assets/loader.gif'

export default memo(function MainSection({ setMovieID, filmSection, setModalVisibility }){
    const [movieLists, setMovieLists] = useState({
      topRated: [{placeholder: loader}],
      popular: [{placeholder: loader}],
      upcoming: [{placeholder: loader}],
    });
    
    const [filteredTopRated, setFilteredTopRated] = useState([{placeholder: loader}]);

    useEffect(() => {
      GET('movie', 'popular', '&language=en-US&page=1')
        .then(data => setMovieLists(prev => ({ ...prev, popular: data.results })));
  
      GET('movie', 'top_rated', '&language=en-US&page=1')
        .then(data => setMovieLists(prev => ({ ...prev, topRated: data.results })));
        
      GET('movie', 'upcoming', '&language=en-US&page=1')
        .then(data => setMovieLists(prev => ({ ...prev, upcoming: data.results })));
        
    }, []);

    useEffect(() => {
        setFilteredTopRated(movieLists.topRated.filter(movie => movie.vote_average >= 8.6))
    }, [movieLists.topRated]);

    return (
        <div className="MainSection">
          <div className="MainSection_background" />
          <div className="MainSection_background--overlay" />
          <div className="MainSection_background--halfoverlay" />
            <MainCard data={movieLists.popular[0]} setMovieID={setMovieID} filmSection={filmSection} className="MainCard_popular" />
            <div className="MainSection_content">
            <h2>Top Rated:</h2>
              <CardList data={filteredTopRated} filmSection={filmSection} setMovieID={setMovieID} setModalVisibility={setModalVisibility} className="topRated"/>
              <h2>Upcoming:</h2>
              <CardList data={movieLists.upcoming} filmSection={filmSection} setMovieID={setMovieID} setModalVisibility={setModalVisibility} className="upcoming"/>
            </div>
        </div>
    )
})