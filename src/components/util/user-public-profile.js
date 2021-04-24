import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import userProfileService from '../../services/bookmark-service';
import userAuthorService from '../../services/recommendation-service'
import userService from "../../services/user-service";

const ProfileDetails = () => {
    const {uid} = useParams();
    const [user, setUser] = useState({})
    const [loaded, setLoaded] = useState(false)
    const [bookmarks, setBookmarks] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        userService.findUserById(uid)
            .then(res => setUser(res));
        setLoaded(true)
    }, [uid]);

    useEffect(() => {
        if (uid) {
            userProfileService.getBookmarksForUser(uid).then(res => setBookmarks(res));
        }
        if (uid && user.role === "AUTHOR") {
            userAuthorService.getRecommendationsForUser(uid).then(res => setRecommendations(res));
        }
    }, [uid, user.role]);

    return (
        <div>
            {loaded && user && user.role === "READER" &&
                <div>
                    <h1>{user.username}'s Profile</h1>
                    <br/>
                    <h3>Bookmarks</h3>
                    <ul className='list-group'>
                        {bookmarks.map(bookmark =>
                            <Link key={bookmark._id}
                                  className='list-group-item'
                                  to={`/details/${bookmark.bookId}`}>
                                {bookmark.bookTitle}
                            </Link>
                        )}
                    </ul>
                </div>
            }
            {loaded && user && user.role === "AUTHOR" &&
            <div>
                <h1>{user.username}'s Profile</h1>
                <br/>
                <h3>Authored Books</h3>
                <ul className='list-group'>
                    {bookmarks.map(bookmark =>
                        <Link key={bookmark._id}
                              className='list-group-item'
                              to={`/details/${bookmark.bookId}`}>
                            {bookmark.bookTitle}
                        </Link>
                    )}
                </ul>
                <br/>
                <h3>Recommendations</h3>
                <ul className='list-group'>
                    {recommendations.map(recommendation =>
                        <Link key={recommendation._id}
                              className='list-group-item'
                              to={`/details/${recommendation.bookId}`}>
                            {recommendation.bookTitle}
                        </Link>
                    )}
                </ul>
            </div>
            }
        </div>
    )
}

export default ProfileDetails;