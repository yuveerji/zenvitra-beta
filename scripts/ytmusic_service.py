import sys
import os
import json

def get_ytmusic():
    try:
        from ytmusicapi import YTMusic
        oauth_path = os.path.join(os.getcwd(), 'oauth.json')
        if os.path.exists(oauth_path):
            return YTMusic(oauth_path)
        return YTMusic()
    except Exception as e:
        return None

def search_tracks(query):
    yt = get_ytmusic()
    if not yt:
        print(json.dumps([]))
        return

    try:
        results = yt.search(query, filter='songs')
        tracks = []
        for item in results[:20]:
            artists = [a.get('name', '') for a in item.get('artists', []) if isinstance(a, dict) and a.get('name')]
            artist_str = ', '.join(artists) if artists else 'Unknown Artist'
            thumbnails = item.get('thumbnails', [])
            thumb_url = thumbnails[-1].get('url') if thumbnails else ''
            vid = item.get('videoId')
            if vid:
                tracks.append({
                    'id': vid,
                    'title': item.get('title', 'Unknown Track'),
                    'artist': artist_str,
                    'album': (item.get('album') or {}).get('name', ''),
                    'duration': item.get('duration', ''),
                    'thumbnail': thumb_url,
                    'videoId': vid,
                    'audioUrl': f"https://www.youtube.com/watch?v={vid}",
                    'source': 'YouTube Music'
                })
        print(json.dumps(tracks))
    except Exception:
        try:
            results = yt.search(query)
            tracks = []
            for item in results[:15]:
                vid = item.get('videoId')
                if vid:
                    artists = [a.get('name', '') for a in item.get('artists', []) if isinstance(a, dict) and a.get('name')]
                    thumbnails = item.get('thumbnails', [])
                    tracks.append({
                        'id': vid,
                        'title': item.get('title', 'Unknown Track'),
                        'artist': ', '.join(artists) if artists else 'Unknown Artist',
                        'album': '',
                        'duration': item.get('duration', ''),
                        'thumbnail': thumbnails[-1].get('url') if thumbnails else '',
                        'videoId': vid,
                        'audioUrl': f"https://www.youtube.com/watch?v={vid}",
                        'source': 'YouTube Music'
                    })
            print(json.dumps(tracks))
        except Exception:
            print(json.dumps([]))

def create_playlist_action(name, desc, vids):
    yt = get_ytmusic()
    if not yt:
        print(json.dumps({'error': 'YTMusic client could not be loaded'}))
        return

    try:
        playlist_id = yt.create_playlist(name, desc)
        if vids:
            yt.add_playlist_items(playlist_id, vids)
        print(json.dumps({'success': True, 'playlistId': playlist_id, 'videoIds': vids}))
    except Exception as e:
        print(json.dumps({'error': str(e)}))

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps([]))
        sys.exit(0)

    action = sys.argv[1]
    if action == 'search':
        q = sys.argv[2] if len(sys.argv) > 2 else 'Oasis Wonderwall'
        search_tracks(q)
    elif action == 'playlist':
        name = sys.argv[2] if len(sys.argv) > 2 else 'Zenvitra Soundtracks'
        desc = sys.argv[3] if len(sys.argv) > 3 else 'Curated playlist'
        video_ids = sys.argv[4].split(',') if len(sys.argv) > 4 else []
        create_playlist_action(name, desc, video_ids)
    else:
        search_tracks(action)
