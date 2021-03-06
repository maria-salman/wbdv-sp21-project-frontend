import React, {useState} from 'react';
import axios from "axios";
import './book-search.css'
import {Link, useHistory} from "react-router-dom";

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [books, setBooks] = useState({ items: [] });
    const history = useHistory();

    const onInputChange = (e) => {
        setSearchTerm(e.target.value);
    }

    let API_URL = `https://www.googleapis.com/books/v1/volumes`;
    const fetchBooks = async () => {
        const result = await axios.get(`${API_URL}?q=${searchTerm}`)
        setBooks(result.data);
    }
    const onSubmitHandler = (e) => {
        e.preventDefault();
        fetchBooks().catch(() => alert('Invalid search term.'));

    }

    const bookAuthors = authors => {
        if (authors === undefined) {
            authors = ""
        }
        else if (authors.length <= 2) {
            authors = authors.join(' and ');
        } else if (authors.length > 2) {
            let lastAuthor = ' and ' + authors.slice(-1);
            authors.pop();
            authors = authors.join(', ');
            authors += lastAuthor;
        }
        return authors;
    }

    const updateSearch = () => history.push(`/search/${searchTerm}`);

    return (
        <section>
            <form onSubmit={onSubmitHandler}>
                <br/>
                <div className="col-sm-6 row">
                    <input
                        type="search"
                        className="form-control col-sm-10"
                        placeholder="Book Title or Author Name"
                        value={searchTerm}
                        onChange={onInputChange}
                    />
                    <button type="submit"
                            className="btn btn-secondary"
                            onClick={updateSearch}>
                        Search
                    </button>
                </div>
                <br/>
            </form>
            {books.items === undefined &&
            <div className="alert-warning col-sm-4">
                Your search returned no results. Try something else.
                </div>
            }
            { searchTerm !== undefined && books.items !== undefined &&
                <div className="bottom-padding">
                    <h6 className="details-text col-sm-10">
                        Click on "More Details" or the book cover to learn more!
                    </h6>
                    <ul>
                        {
                            books.items.map((book, index) => {
                                return (
                                    <li key={index}>
                                        <div>
                                            <br/>
                                            <Link to={`/details/${book.id}`}>
                                                <img alt={`${book.volumeInfo.title} book`}
                                                     src={`http://books.google.com/books/content?id=${book.id}&printsec=frontcover&img=1&zoom=5&source=gbs_api`}/>
                                            </Link>
                                            <div>
                                                <br/>
                                                <h4>{book.volumeInfo.title}</h4>
                                                <p>Author(s): {bookAuthors(book.volumeInfo.authors)}</p>
                                                <p>Description: {book.volumeInfo.description}</p>
                                                <button className="btn btn-primary">
                                                    <Link to={`/details/${book.id}`}
                                                          className="user-name-link">
                                                        More Details
                                                    </Link>
                                                </button>
                                            </div>
                                        </div>
                                        <hr/>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            }
        </section>
    )
}

export default Search;