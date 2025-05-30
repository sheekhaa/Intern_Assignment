import React, { useEffect, useState } from "react";
import { useGetBooksQuery, useUpdateBookMutation, useDeleteBookMutation, useCreateBookMutation, useBuyBookMutation } from "../redux/services/bookApi";
import { Book } from "../redux/services/bookApi";
import { Criteria, EuiBasicTableColumn,  EuiFieldSearch, EuiFlexGroup, EuiFlexItem, EuiText, EuiPopover, EuiIcon, EuiButtonEmpty, useGeneratedHtmlId,  EuiFlyoutHeader, EuiTitle, EuiFlyoutBody, EuiFlyoutFooter, EuiBadge, EuiHeaderSectionItemButton, EuiButtonIcon} from "@elastic/eui";
import { CommomButton } from "../sub-component/button/commonButton";
import { CommonFieldText } from "../sub-component/fieldtext/commonFieldText";
import { CommonTable } from "../sub-component/table/commonTable";
import { CommonFlyout } from "../sub-component/flyout/commonFlyout";
import { CommonModal } from "../sub-component/modal/commonModal";
import { CommonToast } from "../sub-component/toast/commonToast";
import { useDispatch,useSelector  } from "react-redux";
import { RootState } from "../redux/Store";
import { addToCart, removeFromCart } from "../redux/slices/cartSlice";
import { MyToast } from "../sub-component/toast/commonToast";

const HomePage: React.FC = () =>{  
  //for pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, SetPageSize] = useState(4);
  const [searchTerm, setSearchTerm] = useState(""); //for search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null); //for action
  //for flyout
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const [editFlyout, setEditFlyout] = useState<Book | null>(null);
  
  //for modal delete
  const [isModalVisible, setIsModalVisible] =useState(false);
  const [deleteModal, setDeleteModal] = useState <Book | null>(null);

  //for modal buy
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  const [bookTobuy, setBookTobuy] = useState<Book | null>(null);
  
  //for toasts
  const [toasts, setToasts] = useState<MyToast[]>([]);

  const [updateBook] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();
  const [createBook] = useCreateBookMutation();
  const [buyBooks] = useBuyBookMutation();
  
  //for cart
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
const cartItems = useSelector((state: RootState) => state.cart.items);
const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  //for addbookflyout
  const [addBookFlyoutVisible, setAddBookFlyoutVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [author, setAuthor] = useState('');
  const [authorError, setAuthorError] = useState('');
  const [year, setYear] = useState('');
   const [yearError, setYearError] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [price, setPrice] = useState('');  
  const [priceError, setPriceError] = useState('');

  //for edit flyout validation
 const [formErrors, setFormErrors] = useState({   
    title: '',
    author: '',
    year: '',
    quantity: '',
    price: '' 
  });

//debouncing
  useEffect(()=>{
    const timerId = setTimeout(()=>{
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return()=>{
      clearTimeout(timerId);
    };
  },[searchTerm]);
  
  const {data: books = [], isLoading} = useGetBooksQuery(debouncedSearchTerm);

 //for toasts
const addToast = (title: string, color: 'success' | 'danger' | 'warning' | 'primary' = 'success') => {
  const id = `${Date.now()}`;
  setToasts((prev) => [
    ...prev,
    {
      id,
      title,
      color,
      iconType: color === 'success' ? 'check' : 'alert',
    },
  ]);
};

const removeToast = (removedToast: MyToast) => {
  setToasts((prevToasts) =>
    prevToasts.filter((toast) => toast.id !== removedToast.id)
  );
};

 //for add cart related state
 const dispatch = useDispatch(); 
const onAddToCart = (book: any) => {
  dispatch(addToCart(book));
  addToast(`${book.title} added to cart`, 'success');
};

  //for buy modal
  const closeBuyModal = () =>{
    setIsBuyModalVisible(false);
    setBookTobuy(null);
  };

  const handleBuy = async ()=>{
    if(bookTobuy){
      try{
        const response = await buyBooks({items: [{bookId: bookTobuy.id, quantity: 1}]}).unwrap();
        addToast('Purchase Successful', 'success');
        closeBuyModal();
        console.log ("Purchase Successful", response);
      }catch(error){
        console.error("Failed to buy books", error);
      }
    }
  };

  //for modal
  const closeModal = ()=> {
    setDeleteModal(null);
    setIsModalVisible(false);
  }
  const showModal = (book: Book) => {
    setDeleteModal(book);
    setIsModalVisible(true)
  }
  const modalTitleId = useGeneratedHtmlId();
  const handleDeleteModal =async () =>{
    if(deleteModal){
      try{
        await deleteBook(deleteModal.id).unwrap();
        closeModal();        
      }catch(error){
        console.error("Failed delete book", error);
      }
    }
  }

  //handle edit flyout
  const handleEditTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!editFlyout) return;
  const value = e.target.value;
  setEditFlyout({...editFlyout, title: value});
  setFormErrors({
    ...formErrors,
    title: validateTitle(value)
  });
};

const handleEditAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!editFlyout) return;
  const value = e.target.value;
  setEditFlyout({...editFlyout, author: value});
  setFormErrors({
    ...formErrors,
    author: validateAuthor(value)
  });
};

const handleEditYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!editFlyout) return;
  const value = e.target.value;
  setEditFlyout({
    ...editFlyout, 
    year: parseInt(value) || 0
  });
  setFormErrors({
    ...formErrors,
    year: validateYear(value)
  });
};

const handleEditQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!editFlyout) return;
  const value = e.target.value;
  setEditFlyout({
    ...editFlyout, 
    quantity: parseInt(value) || 0
  });
  setFormErrors({
    ...formErrors,
    quantity: validateQuantity(value)
  });
};

const handleEditPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!editFlyout) return;
  const value = e.target.value;
  setEditFlyout({
    ...editFlyout, 
    price: parseFloat(value) || 0
  });
  setFormErrors({
    ...formErrors,
    price: validatePrice(value)
  });
};

const handleEdit = async () => {
  if (!editFlyout) return;  
  const hasErrors = Object.values(formErrors).some(error => error !== '');  
  if (hasErrors) {
    addToast("Please fix the errors before submitting.", "danger");
    return;
  }

  try {
    await updateBook(editFlyout).unwrap();
    setIsFlyoutVisible(false);
    setEditFlyout(null);
    setFormErrors({ title: '', author: '', year: '', quantity: '', price: '' });
    addToast("Book updated successfully", "success");
  } catch (error) {
    console.error('Update failed:', error);
    addToast("Failed to update book", "danger");
  }
}; 

  const onTableChange = ({page}: Criteria<Book>)=>{
    if (page){
      const {index: pageIndex, size: pageSize} = page;
      setPageIndex(pageIndex);
      SetPageSize(pageSize);
    }
  };

  const findBooks = (
      books: Book[],
      pageIndex:number,
      pageSize: number,
      searchTerm: string
      )=>{
    const filtered = books.filter((book)=>{
      const lowerSearch = searchTerm.toLowerCase();
      return(
        book.title.toLowerCase().includes(lowerSearch)||
        book.author.toLowerCase().includes(lowerSearch)
      );   
    });
    

     const startIndex = pageIndex * pageSize;
    let pageOfItems = filtered.slice(
       startIndex,
        Math.min(startIndex + pageSize, books.length)
      );     
   
  return {
    pageOfItems,
    totalItemCount: filtered.length,
  };
  };

  const {pageOfItems, totalItemCount} = findBooks(books, pageIndex, pageSize, debouncedSearchTerm );

  const pagination = {
    pageIndex,
    pageSize,
    totalItemCount,
    pageSizeOptions: [4,8, 12],
  }
  const columns: Array<EuiBasicTableColumn<Book>> = [
    {
      field: "id", 
      name: "ID"
    },

    {
      field: "title",
      name: "Title"
    },
    {
      field: "author",
      name: "Author"
    },
    {
      field: "year",
      name: " Year"
    },
    {
      field: "quantity",
      name: "Quantity"
    },
    {
      field: "price",
      name: "Price ($)",
      render: (price: number) =>price.toFixed(2),
    },
    {
  name: "Action",
  render: (item: Book) => {
    const isOpen = openPopoverId === item.id;
    const onButtonClick = () => {
      setOpenPopoverId(isOpen ? null : item.id);
    };
    const closePopover = () => setOpenPopoverId(null);

    return (
      <EuiPopover
        button={
          <button onClick={onButtonClick} className="euiButtonIcon">
            <EuiIcon
              type="boxesHorizontal"
              className="ueba-table-column-icon"
            />
          </button>
        }
        isOpen={isOpen}
        closePopover={closePopover}
        panelPaddingSize="none"
        className="table-column-popover"
      >
        <EuiFlexGroup direction="column" gutterSize="s">
          <EuiFlexItem>
            <EuiButtonEmpty
              iconType="pencil"
              onClick={() => {
                setEditFlyout(item);
                setIsFlyoutVisible(true);

                // handleEdit(item);
                closePopover();
              }}            >
              Edit
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiButtonEmpty
              iconType="trash"
              color="danger"
              onClick={() => {
                showModal(item);
                closePopover();
              }}
            >
              Delete
            </EuiButtonEmpty>
          </EuiFlexItem>

           <EuiFlexItem>
            <EuiButtonEmpty
              iconType="check"              
              color="success"
              onClick={()=> {
                setBookTobuy(item);
                setIsBuyModalVisible(true);
                closePopover();
              }}                      
            >
              Buy
            </EuiButtonEmpty>
          </EuiFlexItem>

              <EuiFlexItem>
            <EuiButtonEmpty
              iconType="plusInCircle"              
              color="primary"     
              onClick={()=>{
                onAddToCart(item);
                closePopover();
              }}                
            >
              Add to Cart
            </EuiButtonEmpty>
          </EuiFlexItem>

        </EuiFlexGroup>
      </EuiPopover>
    );
  }
}
  ]

  //flyout handle for edit
  const simpleFlyoutTitled = useGeneratedHtmlId();
  let flyout;
  if(isFlyoutVisible && editFlyout){
    flyout = (
      <CommonFlyout 
      ownFocus
      onClose={()=>{ setIsFlyoutVisible(false);
        setEditFlyout(null);
         setFormErrors({ title: '', author: '', year: '', quantity: '', price: '' });
      }}
      aria-labelledby={simpleFlyoutTitled}
      size="m">
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="s">
            <h2 id = {simpleFlyoutTitled}>A Edit Details</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Title:   
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <CommonFieldText value={editFlyout.title} onChange={handleEditTitleChange}/>
               {formErrors.title && <EuiText color="danger" size="xs">{formErrors.title}</EuiText>}  
            </EuiFlexItem>
          </EuiFlexGroup>  

          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Author:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText value={editFlyout.author} onChange={handleEditAuthorChange}/>
               {formErrors.author && <EuiText color="danger" size="xs">{formErrors.author}</EuiText>}  
            </EuiFlexItem>
          </EuiFlexGroup>   

           <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Year:</EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText 
                value={editFlyout.year?.toString() || ''} 
                onChange={handleEditYearChange}
              />
              {formErrors.year && <EuiText color="danger" size="xs">{formErrors.year}</EuiText>}
            </EuiFlexItem>
          </EuiFlexGroup>  

           <EuiFlexGroup>
              <EuiFlexItem>
                <EuiText>Quantity:</EuiText>
              </EuiFlexItem>  
              <EuiFlexItem>
                <CommonFieldText 
                  value={editFlyout.quantity?.toString() || ''} 
                  onChange={handleEditQuantityChange}
                />
                {formErrors.quantity && <EuiText color="danger" size="xs">{formErrors.quantity}</EuiText>}
              </EuiFlexItem>
            </EuiFlexGroup>  

           <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Price:</EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText 
                value={editFlyout.price?.toString() || ''} 
                onChange={handleEditPriceChange}
              />
               {formErrors.price && <EuiText color="danger" size="xs">{formErrors.price}</EuiText>}
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutBody>

        <EuiFlyoutFooter>
          <EuiFlexGroup gutterSize="xl">
            <EuiFlexItem >
              <CommomButton color="warning"
              title="Close"
              onClick={()=>{
                setIsFlyoutVisible(false);
                setEditFlyout(null);
                setFormErrors({ title: '', author: '', year: '', quantity: '', price: '' });
              }}/>             
            </EuiFlexItem>

            <EuiFlexItem >
              <CommomButton color = "primary"title="update" onClick={handleEdit}/>                
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutFooter>
      </CommonFlyout>
    );
  }

  //flyout for add book
  const validateTitle = (value: string) => {
  const regex = /^[a-zA-Z0-9\s]*$/; 
  if (!regex.test(value)) {
    return "Title can only contain letters, numbers and spaces.";
  }
  return "";
};

const validateAuthor = (value: string) => {
  const regex = /^[a-zA-Z\s]*$/; // Only alphabets and spaces
  if (!regex.test(value)) {
    return "Author can only contain letters and spaces.";
  }
  return "";
};

const validateYear = (value: string) => {
  const year = parseInt(value);
  if (isNaN(year) || year < 1000 || year > new Date().getFullYear()) {
    return "Please enter a valid year.";
  }
  return "";
};

const validateQuantity = (value: string) => {
  const quantity = parseInt(value);
  if (isNaN(quantity) || quantity <= 0) {
    return "Quantity must be a positive number.";
  }
  return "";
};

const validatePrice = (value: string) => {
  const price = parseFloat(value);
  if (isNaN(price) || price <= 0) {
    return "Price must be a positive number.";
  }
  return "";
};

const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setTitle(value);
  setTitleError(validateTitle(value));
};

const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setAuthor(value);
  setAuthorError(validateAuthor(value));
};

const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setYear(value);
  setYearError(validateYear(value));
};

const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setQuantity(value);
  setQuantityError(validateQuantity(value));
};

const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setPrice(value);
  setPriceError(validatePrice(value));
};

const handleAddBook = () => {
  if (titleError || authorError || yearError || quantityError || priceError) {   
    addToast("Please fix the errors before submitting.", "danger");
    return;
  }
  
  createBook({
    title,
    author,
    year: parseInt(year),
    quantity: parseInt(quantity),
    price: parseFloat(price),
  }).unwrap();
  addToast("Book added successfully", "success");
  setAddBookFlyoutVisible(false); // Close flyout
}; 

  const addBookFlyout =  addBookFlyoutVisible && (
    <CommonFlyout
    ownFocus
    onClose={()=> setAddBookFlyoutVisible(false)}
    size= "m"
    arialabelledby="addBookFlyoutTitle">
      <EuiFlyoutHeader  hasBorder>
        <EuiTitle size="m">
          <h2 id="addBookFlyoutTitle"> Add new Book</h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Title:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText value={title} onChange={handleTitleChange}/>
               {titleError && <EuiText color="danger" size="xs">{titleError}</EuiText>}
            </EuiFlexItem>
          </EuiFlexGroup> 

            <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Author:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText value={author} onChange={handleAuthorChange}/>
              {authorError && <EuiText color="danger" size="xs">{authorError}</EuiText>}
            </EuiFlexItem>
          </EuiFlexGroup> 

           <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText> Year:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText value={year} onChange={handleYearChange}/>
              {yearError && <EuiText color="danger" size="xs">{yearError}</EuiText>}
            </EuiFlexItem>
          </EuiFlexGroup> 

           <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Quantity:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText value={quantity} onChange={handleQuantityChange}/>
              {quantityError && <EuiText color="danger" size="xs">{quantityError}</EuiText>}
            </EuiFlexItem>
          </EuiFlexGroup> 

           <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Price:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText value={price} onChange={handlePriceChange}/>
              {priceError && <EuiText color="danger" size="xs">{priceError}</EuiText>}
            </EuiFlexItem>
          </EuiFlexGroup>        
      </EuiFlyoutBody>

      <EuiFlyoutFooter>
         <EuiFlexGroup gutterSize="xl">
           <EuiFlexItem >
            <CommomButton color="warning" title="cancel" onClick={()=> setAddBookFlyoutVisible(false)} />              
           </EuiFlexItem>            
           <EuiFlexItem >
            <CommomButton title="Add"  color="primary"        
            onClick= {handleAddBook}/>        

           </EuiFlexItem>
         </EuiFlexGroup> 
      </EuiFlyoutFooter>
    </CommonFlyout>
  )
   
  return(
    <>
     <EuiFlexGroup className="header" direction="column">      
        <EuiText className="font">
          <h2>Book List</h2>
        </EuiText>      
    </EuiFlexGroup>
    <EuiFlexGroup className="sub-header">
      <EuiFlexItem>
        <EuiFieldSearch className="for-search" placeholder="Search book" value={searchTerm}onChange={(e)=>{
          setSearchTerm(e.target.value);
          setPageIndex(0);//reset first page on new search
        }}isClearable></EuiFieldSearch>
      </EuiFlexItem>
      <EuiFlexItem className = "cart"grow = {true}>
         <EuiHeaderSectionItemButton onClick={() => setIsCartModalVisible(true)}>
      <EuiText className="cart-font">Cart</EuiText>
      {totalCount > 0 && (
        <EuiBadge color="text" style={{ margin:"0 5px 0 0" }}>
          {totalCount}
        </EuiBadge>
      )}
    </EuiHeaderSectionItemButton>
       
      </EuiFlexItem>
      <EuiFlexItem grow ={false}>
        
        <CommomButton title="Add" onClick={()=>setAddBookFlyoutVisible(true)}/>
      </EuiFlexItem>
    </EuiFlexGroup>    

    <EuiFlexGroup>
      <EuiFlexItem>
        <CommonTable items={pageOfItems}        
        columns={columns}
        pagination={pagination}
        onChange={onTableChange}
        loading = {isLoading}/>           
      </EuiFlexItem>        

    </EuiFlexGroup>

    {isModalVisible &&(
      <CommonModal
     
      aria-labelledby={modalTitleId}
      style={{width:600}}
      title = "Are you sure want to delete this book's details?"
      titleProps={{id: modalTitleId}}
      onCancel={closeModal}
      onConfirm={handleDeleteModal}
      cancelButtonText = "Cancel"
      confirmButtonText = "Delete"
      defaultFocusedButton="confirm"
      buttonColor="danger"
      > 
      <p>This will permantantly delete the book's details.</p></CommonModal>
    )}
    {addBookFlyout}
    {flyout}

    {isBuyModalVisible && bookTobuy && (
      <CommonModal
      title = "Confirm Purchase"
      onCancel={closeBuyModal}
      onConfirm={async()=>{
        await handleBuy(); //triggers API call
        closeBuyModal(); //close modal after successful buy
      }}
     cancelButtonText= "Cancel"
      confirmButtonText = "Buy"
      defaultFocusedButton ="confirm">
        <p>
    Are you sure you want to buy <strong>{bookTobuy.title}</strong> by{" "}
    {bookTobuy.author} for <strong>{bookTobuy.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</strong>?
  </p>
      </CommonModal> 
    )}
    <CommonToast
     toasts={toasts}
     dismissToast={removeToast}
     toastLifeTimeMs={3000}/>

    {/* Add to Cart flyout */}
{isCartModalVisible && (
  <CommonFlyout
    onClose={() => setIsCartModalVisible(false)}
    size="s"
    ownFocus
  >
    <EuiFlyoutHeader hasBorder>
      <EuiTitle size="m"><h5>Your Cart ({totalCount} items)</h5></EuiTitle>
    </EuiFlyoutHeader>
   
    <EuiFlyoutBody>
      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (        
        <EuiFlexGroup direction="column" gutterSize="xl">
          {cartItems.map((item, index) => (
            <EuiFlexItem key={index}>
              <EuiFlexGroup >
                {/* Book Info */}
                <EuiFlexItem grow={true}>
                  <EuiText>
                    <p>{item.title} by {item.author}</p>
                  </EuiText>
                </EuiFlexItem>
                </EuiFlexGroup>

                {/* Quantity */}
                <EuiFlexGroup>
                <EuiFlexItem grow={false}>
                  <EuiText>
                    <p>Qty: {item.quantity}</p>
                  </EuiText>
                </EuiFlexItem>
                </EuiFlexGroup>

                {/* Price */}
                <EuiFlexGroup>
                <EuiFlexItem grow={false}>
                  <EuiText>
                    <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
                  </EuiText>
                </EuiFlexItem>
                </EuiFlexGroup>  

                
                <EuiFlexItem grow={true}>
                  <EuiButtonIcon 
                    iconType="trash"
                    color="danger"
                    aria-label="Remove item"
                    onClick={() => {
                      dispatch(removeFromCart(item.id));
                      addToast(`${item.title} removed from cart`, 'warning');
                    }}
                  />
                </EuiFlexItem>             
            </EuiFlexItem>
          ))}
        </EuiFlexGroup>
       
      )}
    </EuiFlyoutBody>
    
  
  </CommonFlyout>
)}
    </>
  )
}
export default HomePage;

