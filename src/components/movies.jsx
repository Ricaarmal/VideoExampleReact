import React, { Component } from 'react';
import { getMovies, deleteMovies } from '../services/movieService';
import { getGenres } from '../services/genreService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import GenreList from './common/GenreList';
import Pagination from './common/pagination';
import { paginate } from '../utils/paginate';
import MoviesTable from './MoviesTable';
import SearchBox from './SearchBox';
import _ from 'lodash';

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: '',
    selectedGenre: null,
    sortColumn: { path: 'title', order: 'asc' }
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: '', name: 'AllGenres' }, ...data];

    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }

  handleDelete = async movie => {
    const originalMovies = this.state.movies;
    let movies = originalMovies.filter(
      pollollon => pollollon._id !== movie._id
    );
    this.setState({ movies });

    try {
      await deleteMovies(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error('This Movie has already been deleted.');

        this.setState({ movies: originalMovies });
      }
    }
  };

  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchQuery: '', currentPage: 1 });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchQuery,
      movies: allMovies
    } = this.state;

    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLocaleLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const { length: count } = this.state.movies;
    const { currentPage, pageSize, sortColumn } = this.state;

    if (count === 0) return <p>There are no movies in the database</p>;

    const { totalCount, data: movies, searchQuery } = this.getPageData();

    return (
      <div className="row">
        <div className="col-3">
          <GenreList
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          <Link
            to="/movies/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            New Movie
          </Link>
          <p>Showing {totalCount} movies in the database</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
