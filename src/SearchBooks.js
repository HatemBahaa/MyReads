import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as BooksAPI from './BooksAPI'

// this component is resposible for rendering book search form and search results and managing their functionality
class SearchBooks extends Component{

    state={
        searchedBooks:[],
        searchQuery : ''
    }


    // updates searchQuery state by controlled form
    updateQuery = (stringValue)=>{    
        this.setState(()=>({searchQuery : stringValue})) 
        console.log(this.state.searchQuery)  
    }
    
    
    // Getting search resultes every time state changes in "searchQuery" by using 'search' Method
    // Then assign results by changing state in "searchedBooks" while using conditions to handle errors
    // "check" is used to prevent repeating post request infinitly as we keep changing state
    check=[]
    componentDidUpdate(){
       
        if(this.state.searchQuery !== this.check && this.check !== undefined){
            if(this.state.searchQuery === ''){
                this.setState({searchedBooks:[]})
                console.log(this.state.searchedBooks)
            }
            else{
                BooksAPI.search(this.state.searchQuery).then((books)=>{
                    Object.keys(books)[0] === 'error' 
                    ?  this.setState({searchedBooks:[]}) 
                    : this.setState({searchedBooks:books}) 
                })  
            }            
        }  
       this.check = this.state.searchQuery 
    }
    
  
    
    render(){
        let isOnShelf 
       
        console.log(this.props.sendBooksIds)
        return(
            <div>
                {/* //////////////////search bar////////////////////// */}
                <div className="search-books-bar">
                    <Link
                        to='/' 
                        className="close-search" 
                    >Close</Link>

                    <div className="search-books-input-wrapper">
                        <input 
                            type="text" 
                            placeholder="Search by title or author"
                            value={this.state.searchQuery}
                            onChange={(event)=>{this.updateQuery(event.target.value)}}
                        />
                        {/* for testing controlled form */}
                        {/* {JSON.stringify(this.state.searchQuery)} */}
                    </div>
                </div>
                
                {/* //////////////////search results////////////////////// */}
               
                <div className="search-books-results">
                    <ol className="books-grid">
                        {this.state.searchedBooks !== []       
                            ?this.state.searchedBooks.map((book)=>(
                            
                            <li key={book.id}>
                                    {/* testing array elements that is on shelf sent by comoponent props if matches current mapped book */}
                                    {this.props.sendBooksIds.find((test)=>test.bookId===book.id)
                                        ?isOnShelf=true
                                        :isOnShelf=false 
                                    }
                            <div className="book">
                                <div className="book-top">
                                    
                                    <div className="book-cover" style={
                                        // handling missing thumbnails
                                        book.imageLinks === undefined
                                        ?{ width: 128, height: 193,   backgroundImage: `url('https://via.placeholder.com/128x193.jpg?text=Placeholder')` }
                                        :{ width: 128, height: 193,   backgroundImage: `url('${book.imageLinks.thumbnail}')` }
                                        }>
                                    </div>
                                    
                                    <div className="book-shelf-changer">
                                            <select 
                                                // assigning default value of select tag based on the test above (if it isOnShelf assign its shelf name)
                                                defaultValue={isOnShelf
                                                    ? this.props.sendBooksIds.find((test)=>test.bookId===book.id).shelfName
                                                    :'none'
                                                }
                                                // conditioning on change action based on shelf or not if true then change shelf by revoking "changeShelf" function in app component 
                                                // if false add as a new book in selected shelf by revoking "newBook" function in app component 
                                                onChange={isOnShelf
                                                    ?(event)=>{this.props.onChangeShelf(book, event.target.value, 'search')}
                                                    :(event)=>{this.props.onNewBook(book, event.target.value)}
                                                }
                                            >
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
                        ))
                        :<li></li>} 
                    </ol>
                </div>

            </div>
            
        )
    }
}

export default SearchBooks;