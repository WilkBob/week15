import { useEffect, useState, useContext} from 'react';
import { Button, IconButton, capitalize } from '@mui/material';
import { Favorite as FavoriteIcon, MoreHorizOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getImageUrl, getPokemonById } from '../API/pokemon'; // import toggleFavorite
import { UserContext } from '../context/UserContext';
import { getFavorites, toggleFavorite } from '../API/firedb';

const PokeCard = ({ id, position }) => {
  const [pokemon, setPokemon] = useState(null);
  const [favorites, setFavorites] = useState({});
  const { user } = useContext(UserContext);
  const navigate = useNavigate();



  useEffect(() => {
    if (id) {
      getPokemonById(id).then((data) => {
        setPokemon(data);
      });
    } else {
      setPokemon(null);
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      getFavorites(user.uid).then((data) => {
        setFavorites(data || {});
      });
    }
  }, [user, id]);

  const isFavorite = favorites.hasOwnProperty(id) ? favorites[id] : false;

 const handleFavoriteClick = () => {
  if (!user) {
    navigate('/login');
    return;
  }
//2 pokemon use -f or -m for their gender, so we need to capitalize the first letter and replace the gender markers with their unicode characters
  

  const newFavorites = { ...favorites };
  if (isFavorite) {
    delete newFavorites[id];
  } else {
    newFavorites[id] = true;
  }
  setFavorites(newFavorites);
  toggleFavorite(user.uid, id);
};

const capitalizeAndParseGender = (name) => {
  if(!name) return '';
  if (name.includes('-f')) {
    return name.charAt(0).toUpperCase() + name.slice(1).replace('-f', '\u2640');
  } else if (name.includes('-m')) {
    return name.charAt(0).toUpperCase() + name.slice(1).replace('-m', '\u2642');
  } else {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
};
  const className = `PokeCard position-${position} ${pokemon ? pokemon.types[0].type.name  : ''}`;

  if (!pokemon) return null;

  return (
    <div className={`poke-card ${className} text-light`}>
      <div className='poke-card-media'>
        <img
          onClick={() => navigate(`/pokemon/${id}`)}
          height='200'
          src={getImageUrl(id)}
          alt={pokemon.name}
        />
      </div>
      <div className='poke-card-content'>
        <h2>{capitalizeAndParseGender(pokemon.name)} 
        <IconButton onClick={handleFavoriteClick}>
          <FavoriteIcon color={isFavorite ? 'secondary' : 'default'} />
        </IconButton>
        </h2>
        <p>#{id.toString().padStart(3, '0')}</p>
        
        <Button sx={{marginBottom: '5px'}} onClick={() => navigate(`/pokemon/${id}`)} startIcon={<MoreHorizOutlined/>}>
          Details
        </Button>
        
      </div>
    </div>
  );
};

export default PokeCard;