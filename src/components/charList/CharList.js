import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import { SpinnerCircular } from 'spinners-react';
import Error from '../error/error';

import './charList.scss';

class CharList extends Component {

    state = {
        chars: [],
        loading: true,
        error: false,
        newCharLoading: false,
        offset: 1550,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChars();
    }

    updateChars = (offset) => {
        this.onCharLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharsLoaded)
    }

    onCharLoading = () => {
        this.setState({
            newCharLoading: true
        })
    }

    onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars < 9) {
            ended = true;
        }

        this.setState(({offset, chars}) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newCharLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onRenderChars(chars) {
        const charList = chars.map((char) => {
            const imgStyle = char.thumbnail.includes('image_not_available') ? {'objectFit' : 'fill'} : {'objectFit' : 'cover'};
                        
            return (
                <li className="char__item"
                    key={char.id}                 
                    onClick={() => this.props.onCharSelected(char.id)}>
                      <img src={char.thumbnail} alt={char.name} style={imgStyle}/>
                      <div className="char__name">{char.name}</div>
                </li>
            )
        })
        
        return (
            <ul className="char__grid">
                {charList}
            </ul>
        )
    }

    render() {
        const {chars, loading, error, newCharLoading, offset, charEnded} = this.state;
        const viewChars = this.onRenderChars(chars)

        const spinner = loading ? <div className='randomchar__spinner'><SpinnerCircular style={{margin: 'auto'}} size={200} color={'#9F0013'}/></div> : null;
        const errorMessage = error ? <Error/> : null;
        const content = !(spinner || errorMessage) ? viewChars : null;
        
        return (
            <div className="char__list">
                { spinner }
                { errorMessage }
                { content }
                
                <button className="button button__main button__long"
                        disabled={newCharLoading}
                        style={{'display': charEnded ? 'none' : 'block'}}
                        onClick={() => this.updateChars(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }

}

export default CharList;