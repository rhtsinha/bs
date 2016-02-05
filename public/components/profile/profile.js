angular.module('controllers')

.controller( 'ProfileCtrl', [ '$scope', '$http', '$window',
  function( $scope, $http, $window ) {

      if ( !$window.localStorage.token ) {
          $window.location.assign( '/#' );
      }

      $http.get('/api/profile/')
      .then( res => {
          $scope.username = res.data.username;
          $scope.id = res.data.id;
          $scope.about = res.data.about;
          $scope.picture = 'https://graph.facebook.com/' + $scope.id + '/picture?height=200&width=200';
          $http.get('/api/books?owner=' + $scope.id)
              .then( res => {
                $scope.books = res.data;
                })
              .catch( err => {
                console.log(err[0]);
                });
            })
            .catch( err => { console.log( err[0] ); });


      $http.get('/api/profile/books?search=borrowing')
         .then( res => {
            $scope.borrowing = res.data;
          })
        .catch( err => {
            console.log(err);
        });



      $http.get('/api/profile/books?search=lending')
      .then( res => {
        $scope.lending = res.data;
      })
      .catch( err => {
        console.log(err[0]);
      });

      $scope.addbook = function(  title, author, comment ){

          $http.post( '/api/profile/books',
                    {   title: title,
                        author: author,
                        comment: comment}
                    )
              .then (res => {
                console.log(res.data);
                $scope.books.push(res.data);
              })
              .catch(err => {
                console.log(err);
              });
      };

      $scope.returnBook = function(borrowedBook, index) {
        $http.patch(`api/profile/books/${borrowedBook._id}?request=return`)
             .then( res => {
                console.log(res.data);
                $scope.borrowing.splice(index, 1);
             });
      }

      $scope.delete = function(book, index) {
        $http({
          method: 'DELETE',
          url: '/api/profile/books/' + book._id
        }).then( res => {
          $scope.deleteResponse = res.data;
          $scope.books.splice(index, 1);
        })
        .catch( err => {
          console.log(err);
        });
      }

  }
]);
