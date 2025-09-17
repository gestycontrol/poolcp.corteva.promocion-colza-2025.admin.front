/**
 * Video URL parsing and embed utilities
 */

/**
 * Extract video ID from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if not found
 */
export function extractYouTubeId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

/**
 * Extract video ID from Vimeo URL
 * @param {string} url - Vimeo URL
 * @returns {string|null} - Video ID or null if not found
 */
export function extractVimeoId(url) {
    const patterns = [
        /vimeo\.com\/(\d+)/,
        /vimeo\.com\/groups\/[^\/]+\/videos\/(\d+)/,
        /vimeo\.com\/channels\/[^\/]+\/(\d+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

/**
 * Extract video ID from Facebook URL
 * @param {string} url - Facebook URL
 * @returns {string|null} - Video ID or null if not found
 */
export function extractFacebookId(url) {
    const patterns = [
        /facebook\.com\/[^\/]+\/videos\/(\d+)/,
        /facebook\.com\/video\.php\?v=(\d+)/,
        /facebook\.com\/watch\/\?v=(\d+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

/**
 * Extract file ID from Google Drive URL
 * @param {string} url - Google Drive URL
 * @returns {string|null} - File ID or null if not found
 */
export function extractGoogleDriveId(url) {
    const patterns = [
        /drive\.google\.com\/file\/d\/([^\/]+)/,
        /drive\.google\.com\/open\?id=([^&\n?#]+)/,
        /docs\.google\.com\/uc\?id=([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

/**
 * Detect if URL is from an external video platform
 * @param {string} url - Video URL
 * @returns {Object|null} - Platform info or null if not external
 */
export function detectExternalVideo(url) {
    if (!url) return null;

    const youtubeId = extractYouTubeId(url);
    if (youtubeId) {
        return {
            platform: 'youtube',
            id: youtubeId,
            embedUrl: `https://www.youtube.com/embed/${youtubeId}`
        };
    }

    const vimeoId = extractVimeoId(url);
    if (vimeoId) {
        return {
            platform: 'vimeo',
            id: vimeoId,
            embedUrl: `https://player.vimeo.com/video/${vimeoId}`
        };
    }

    const facebookId = extractFacebookId(url);
    if (facebookId) {
        return {
            platform: 'facebook',
            id: facebookId,
            embedUrl: `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/video.php?v=${facebookId}&show_text=0`
        };
    }

    const googleDriveId = extractGoogleDriveId(url);
    if (googleDriveId) {
        return {
            platform: 'google-drive',
            id: googleDriveId,
            embedUrl: `https://drive.google.com/file/d/${googleDriveId}/preview`
        };
    }

    return null;
}

/**
 * Generate embed HTML for external video
 * @param {Object} videoInfo - Video information object
 * @returns {string} - HTML embed code
 */
export function generateEmbedHtml(videoInfo) {
    const { platform, embedUrl } = videoInfo;

    const baseAttrs = 'frameborder="0" allowfullscreen class="ratio ratio-16x9"';

    switch (platform) {
        case 'youtube':
            return `<iframe src="${embedUrl}?rel=0" ${baseAttrs}></iframe>`;
        case 'vimeo':
            return `<iframe src="${embedUrl}?title=0&byline=0&portrait=0" ${baseAttrs}></iframe>`;
        case 'facebook':
            return `<iframe src="${embedUrl}" ${baseAttrs} scrolling="no"></iframe>`;
        case 'google-drive':
            return `<iframe src="${embedUrl}" ${baseAttrs}></iframe>`;
        default:
            return '';
    }
} 