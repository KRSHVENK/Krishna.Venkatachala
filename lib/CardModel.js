(function () {

    var module = angular.module("colourMemoryModel", ["memory-game"]);

}());

function ExampleCtrl($scope) {

    $scope.cardsSrc =
                [
                   '../images/colour4.gif',
                   '../images/colour3.gif',
                   '../images/colour7.gif',
                   '../images/colour1.gif',
                   '../images/colour5.gif',
                   '../images/colour2.gif',
                   '../images/colour6.gif',
                   '../images/colour8.gif'
                ];
    $scope.count = '';

    // Listeners for events triggered by child
    $scope.$on("memoryGameUnmatchedPairEvent", function () {
        $scope.count -= 1;
    });
    $scope.$on("memoryGameMatchedPairEvent", function () {
        $scope.count += 1;
    });
    $scope.$on("memoryGameCompletedEvent", function () {
        
        var count = $scope.count;
        $scope.count = '';
        switch (count) {
            case 0-1:
                $scope.message = "Not Bad! Your total score is " + count;
                break;
            case 2-4:
                $scope.message = "Good game! Your total score is " + count;
                break;
            case 5-7:
                $scope.message = "Congratulations! You just cracked it well with total score of " + count + "Well done";
            default:
                $scope.message = "Not Impressive! Your total score is " + count;
                break;
        }
    });

    $scope.restartBtn = function () {
        $scope.count = '';
        $scope.message = '';
        var newParams = {
            "cardsSrc":  $scope.cardsSrc
        };
        $scope.$broadcast("memoryGameRestartEvent", newParams);
    };

}