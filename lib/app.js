(function () {

    
    angular
    .module("memory-game", [])
    .controller('MemoryGameCtrl', ['$scope', '$attrs', '$timeout', function ($scope, $attrs, $timeout) {

        
        $scope.init = function () {
            // Check coherence between numbers of lines*columns, and numers of provided images
            if ($scope.cardsSrc.length * 2 === $attrs.lines * $attrs.columns) {
                var deck = makeDeck($scope.cardsSrc);
                $scope.grid = makeGrid(deck);
                $scope.firstPick = $scope.secondPick = undefined;
                $scope.unmatchedPairs = $scope.cardsSrc.length;
            } else {
                console.log("ERROR in memoryGame directive: Bad parameters (check number of lines and row and number image files)");
            }
        }

        // On load, init the game
        $scope.init();

        function Card(title) {
            this.title = title;
            this.flipped = false;
        }

        
        Card.prototype.flip = function () {
            this.flipped = !this.flipped;
        };

        
        $scope.flipCard = function (card) {
            if (card.flipped) {
                return;
            }
            card.flip();
            if (!$scope.firstPick) {
                $scope.firstPick = card;
            } else {
                if ($scope.firstPick.title === card.title) {
                    $scope.unmatchedPairs--;
                    $scope.$emit("memoryGameMatchedPairEvent");
                    if ($scope.unmatchedPairs == 0) {
                        $scope.$emit("memoryGameCompletedEvent");
                    }
                } else {
                    $scope.secondPick = card;
                    $scope.$emit("memoryGameUnmatchedPairEvent");
                    var tmpFirstPick = $scope.firstPick;
                    var tmpSecondPick = $scope.secondPick;
                    $timeout(function () {
                        tmpFirstPick.flip();
                        tmpSecondPick.flip();
                    }, 1000);
                }
                $scope.firstPick = $scope.secondPick = undefined;
            }
        };

        $scope.$on("memoryGameRestartEvent", function (event, args) {
            if (args && args.cardsSrc) {
                $scope.cardsSrc = args.cardsSrc;
            }
           $scope.init();
        });

       
        function makeDeck(cardNames) {
            var cardDeck = [];
            for (var i = 0; i < cardNames.length; i++) {
                cardDeck.push(new Card(cardNames[i]));
                cardDeck.push(new Card(cardNames[i]));
            };
            return cardDeck;
        }


        
        function makeGrid(cardDeck) {
            var grid = [];
            for (var row = 0; row < $attrs.lines; row++) {
                grid[row] = [];
                for (var col = 0; col < $attrs.columns; col++) {
                    grid[row][col] = removeRandomCard(cardDeck);
                }
            }
            return grid;
        }

        
        function removeRandomCard(cardDeck) {
            var i = Math.floor(Math.random() * cardDeck.length);
            return cardDeck.splice(i, 1)[0];
        }

    }])

    //Custom Directive
    .directive("memoryGame", function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                cardsSrc: "=",
                cardHeight: "@",
                cardWidth: "@"
            },
            template: '<table class="memory-game">' +
                          '<tr ng-repeat="line in grid">' +
                            '<td ng-repeat="card in line" class="container">' +
                              '<div class="card" ng-class="{flipped: card.flipped}" ng-click="flipCard(card)">' +
                                  '<img class="front" ng-src="{{card.title}}" width="{{cardWidth}}" height="{{cardHeight}}">' +
                                  '<img class="back" ng-src="../images/card_bg.gif" width="{{cardWidth}}" height="{{cardHeight}}">' +
                              '</div>' +
                            '</td>' +
                          '</tr>' +
                        '</table>',
            controller: 'MemoryGameCtrl'
        };
    });

}());