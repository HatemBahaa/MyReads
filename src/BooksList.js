import React, {Component} from "react";

// this component is resposible for rendering book shelf based on the filter found in the app component
class BooksList extends Component {
       
    render(){
        return(
            <ol className="books-grid">
                {this.props.booksItems.map((book) =>(
                    <li key={book.id}>
                        <div className="book">
                            <div className="book-top">
                                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url('${book.imageLinks.thumbnail}')` }}>
                                </div>
                                <div className="book-shelf-changer">
                                    <select defaultValue={'move'} onChange={(event)=>{this.props.onChangeShelf(book, event.target.value, 'shelf')}}>
                                        <option value="move"  disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                            </div>
                            <div className="book-title">{book.title}</div>
                            <div className="book-authors">{book.authors}</div>
                            
                        </div>
                    </li>  
                ))}
            </ol>
        )
    }
}

export default BooksList;