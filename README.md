Game Board JS
=============

Generic board infrastructure to play many board games in your web browser.

Currently it can representate invariable boards with invariable pieces.
User can move the pieces between positions by selecting a piece from
any position and then click on another position of the board.

To create a new board, you must provide the board and pieces as images, and
write the configuration declaring the coordinates of the available positions.

Every piece can be contained in any position of the board, but
only positions marked as boxes can contain more than one piece.
In those boxes only the last piece stacked will be shown.

Configuration
-------------

An example of configuration is provided.

Each piece is displayed by an image assigned to it in the configuration
(and an optional image can be associated to use it when piece is selected).
At least, one piece must be assigned to every position, and the first piece
in a position (called "empty" piece) will never be moved, because its image
is the area that can be clicked to put another piece on that position.

In the configuration, each position is identified by integers "ROW,COL".
The coordinates for that position in the page are obtained from these
integers multiplying them with the values of multiplier_x and multiplier_y,
and then adding the values in offset_x and offset_y (using y values for ROW).
To get the coordinates to put the image of a piece in that position, also the
values of properties center_x and center_y from the piece are substracted.

