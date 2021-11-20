import React from 'react'
import { Route } from 'react-router'
import './App.css'
import * as BooksAPI from './BooksAPI'
import BooksList from './BooksList'
import SearchBooks from './SearchBooks'
import {Link} from 'react-router-dom'

class BooksApp extends React.Component {
  state = {
    books : [],
  }

  //Gettin starter books by "getAll" method
  componentDidMount(){
    BooksAPI.getAll().then((books) => this.setState({books}))   
  }

  
  // Function sent as props for both "BooksList" & "SearchBooks" components
  // responsible for changing book shelf either from the shelf itself or from search page, and updates backend with new shelf status 
  changeShelf = (book, shelfName, src) => {   
    book.shelf = shelfName; 
    if(src==='shelf'){  
      if(shelfName === 'none'){
          this.setState({books : this.state.books.filter((book) =>(book.shelf !== 'none'))});    
        } else {
          this.setState({books : this.state.books});
        }
    } else {   
      if(shelfName === 'none'){
            this.setState({books :
              this.state.books.filter((bookInBooks)=>(bookInBooks.id!==book.id))
            });    
        } else {
          this.setState((prevstate)=>{prevstate.books.find((bookInBooks)=>bookInBooks.id===book.id).shelf=shelfName});
        }
    }

    BooksAPI.update(book, shelfName)
  }

  // Function sent as props for "SearchBooks"
  // responsible for adding new book to a shelf (based on selected shelf) from search page, and updates backend with new book status 
  newBook =(book, shelfName)=>{
    book.shelf = shelfName;
    this.setState({ books: this.state.books.concat(book)});
    
    BooksAPI.update(book, shelfName)
  }

  
  booksIds = []
  

  render() {

    // stores data (id,shelf) about current books found in "books" in component state
    // used by "SearchBooks" component to show the current shelf status (in search results) of books already found on shelfs  
    this.booksIds = this.state.books.map((book)=>{return {bookId: book.id,shelfName: book.shelf}})   
    
    return (
      <div className="app">
        <Route exact path='/' render={()=>(
        <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>

            <div className="list-books-content">
              <div>

                  {/*Currently Reading Shelf */}
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Currently Reading</h2>
                    <div className="bookshelf-books">
                      <ol className="books-grid">                     
                        <BooksList
                          booksItems={this.state.books.filter((book) => (book.shelf === "currentlyReading"))}
                          onChangeShelf={this.changeShelf}
                        />
                      </ol>
                    </div>
                  </div>

                  {/* Want To Read Shelf */}
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Want To Read</h2>
                    <div className="bookshelf-books">
                      <ol className="books-grid">                     
                        <BooksList                          
                          booksItems={this.state.books.filter((book) => (book.shelf === "wantToRead"))}
                          onChangeShelf={this.changeShelf}
                        />
                      </ol>
                    </div>
                  </div>
            
                  {/* Read Shelf */}
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Read</h2>
                    <div className="bookshelf-books">
                      <ol className="books-grid">                     
                        <BooksList                         
                          booksItems={this.state.books.filter((book) => (book.shelf === "read"))}
                          onChangeShelf={this.changeShelf}
                        />
                      </ol>
                    </div>
                  </div>

              </div>
            </div>
            <div className="open-search">
              <Link to='/search'><button >Add a book</button></Link>
              
            </div>
        </div>
         )} />

        <Route path='/search' render={()=>(
          <SearchBooks 
            onNewBook={this.newBook}
            sendBooksIds={this.booksIds}
            onChangeShelf={this.changeShelf}
          />

        )} />
      </div>
     
      
    )
  }
}

export default BooksApp
