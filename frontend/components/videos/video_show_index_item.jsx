import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

const VideoShowIndexItem = ({ video }) => {
    if (video.thumbnail === "") {
        video.thumbnail = window.defaultThumbnailURL;
    }
    
    return (
        <Link to={`/videos/${video.id}`} key={video.id} className="video-show-index-link">
            <div className="video-show-index-item">
                <div className="video-show-index-item-thumbnail">
                    <img src={video.thumbnail} />
                </div>

                <div className="video-show-index-item-details">
                    <div className="video-show-index-item-title">{video.title}</div>

                    <div className="video-show-index-item-uploader-username">{video.uploader}</div>

                    <div className="video-show-index-item-stats">
                        <div className="video-show-index-item-views-count">{video.views} Views</div>
                        <FontAwesomeIcon icon={faCircle} className="video-circle-divider" />
                        <div className="video-creation-date">{video.creationDate}</div>
                    </div>
                </div>
                
            </div>
        </Link>
    );
};

export default withRouter(VideoShowIndexItem);