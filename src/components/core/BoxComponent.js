/**

Job: Handle everything related to a BoxComponent element dimensioning and positioning

Knows: Parents and children dimensions and positions

It's worth noting that in three-mesh-ui, it's the parent Block that computes
its children position. A Block can only have either only box components (Block)
as children, or only inline components (Text, InlineBlock).

 */
export default function BoxComponent( Base ) {

	return class BoxComponent extends Base {

		constructor( options ) {

			super( options );

			this.isBoxComponent = true;
			this.childrenPos = {};
		}


		/** Get width of this component minus its padding */
		getInnerWidth() {

			const DIRECTION = this.getContentDirection();

			switch ( DIRECTION ) {

				case 'row' :
				case 'row-reverse' :
					if(this.padding === undefined) this.padding = [0 ,0 ,0 ,0];
					return this.width - ( (this.padding[1] + this.padding[3]) || 0 ) || this.getChildrenSideSum( 'width' );

				case 'column' :
				case 'column-reverse' :
					return this.getHighestChildSizeOn( 'width' );

				default :
					console.error( `Invalid contentDirection : ${DIRECTION}` );
					break;

			}

		}

		/** Get height of this component minus its padding */
		getInnerHeight() {

			const DIRECTION = this.getContentDirection();

			switch ( DIRECTION ) {

				case 'row' :
				case 'row-reverse' :
					return this.getHighestChildSizeOn( 'height' );

				case 'column' :
				case 'column-reverse' :
					if(this.padding === undefined) this.padding = [0 ,0 ,0 ,0];
					return this.height - (this.padding[0] + this.padding[2]) || this.getChildrenSideSum( 'height' );

				default :
					console.error( `Invalid contentDirection : ${DIRECTION}` );
					break;

			}

		}

		/** Return the sum of all this component's children sides + their margin */
		getChildrenSideSum( dimension ) {
			return this.children.reduce( ( accu, child ) => {
				if(child.margin === undefined) child.margin = [0 ,0 ,0 ,0];
				if ( !child.isBoxComponent ) return accu;

				let CHILD_SIZE = 0;
				if( dimension === 'width' ) {
					const margin = ( child.margin[1] + child.margin[3] ) || 0;
					CHILD_SIZE = child.getWidth() + margin;
				} else {
					const margin = ( child.margin[0] + child.margin[2] ) || 0;
					CHILD_SIZE = child.getHeight() + margin;
				}
				return accu + CHILD_SIZE;

			}, 0 );

		}

		/** Look in parent record what is the instructed position for this component, then set its position */
		setPosFromParentRecords() {

			if ( this.getUIParent() && this.getUIParent().childrenPos[ this.id ] ) {

				this.position.x = ( this.getUIParent().childrenPos[ this.id ].x );
				this.position.y = ( this.getUIParent().childrenPos[ this.id ].y );

			}

		}

		/** Position inner elements according to dimensions and layout parameters. */
		computeChildrenPosition() {

			if ( this.children.length > 0 ) {

				const DIRECTION = this.getContentDirection();
				let X_START, Y_START;

				switch ( DIRECTION ) {

					case 'row' :

						// start position of the children positioning inside this component
						X_START = this.getInnerWidth() / 2;

						this.setChildrenXPos( -X_START );

						this.alignChildrenOnY();

						break;

					case 'row-reverse' :

						// start position of the children positioning inside this component
						X_START = this.getInnerWidth() / 2;

						this.setChildrenXPos( X_START );

						this.alignChildrenOnY();

						break;

					case 'column' :

						// start position of the children positioning inside this component
						Y_START = this.getInnerHeight() / 2;

						this.setChildrenYPos( Y_START );

						this.alignChildrenOnX();

						break;

					case 'column-reverse' :

						// start position of the children positioning inside this component
						Y_START = this.getInnerHeight() / 2;

						this.setChildrenYPos( -Y_START );

						this.alignChildrenOnX();

						break;

				}

			}

		}

		/** Set children X position according to this component dimension and attributes */
		setChildrenXPos( startPos ) {
			const JUSTIFICATION = this.getJustifyContent();

			if ( JUSTIFICATION !== 'center' && JUSTIFICATION !== 'start' && JUSTIFICATION !== 'end' ) {
				console.warn( `justifiyContent === '${JUSTIFICATION}' is not supported` );
			}

			this.children.reduce( ( accu, child ) => {
				if(child.margin === undefined) child.margin = [0 ,0 ,0 ,0];
				if ( !child.isBoxComponent ) return accu;

				const CHILD_ID = child.id;
				const CHILD_WIDTH = child.getWidth();
				let CHILD_MARGIN = 0;
				let CHILD_MARGIN_END = 0;

				switch (JUSTIFICATION) {
					case "center":
						CHILD_MARGIN = child.margin[3];
						CHILD_MARGIN_END = child.margin[1];
						break;
					case "start":
						CHILD_MARGIN = child.margin[3];
						CHILD_MARGIN_END = child.margin[1];
						break;
					case "end":
						CHILD_MARGIN = child.margin[1];
						CHILD_MARGIN_END = child.margin[3];
						break;
				}

				accu += CHILD_MARGIN * -Math.sign( startPos );

				this.childrenPos[ CHILD_ID ] = {
					x: accu + ( ( CHILD_WIDTH / 2 ) * -Math.sign( startPos ) ),
					y: 0
				};

				return accu + ( -Math.sign( startPos ) * ( CHILD_WIDTH + CHILD_MARGIN_END ) );

			}, startPos );

			//

			if ( JUSTIFICATION === 'end' || JUSTIFICATION === 'center' ) {

				let offset = ( startPos * 2 ) - ( this.getChildrenSideSum( 'width' ) * Math.sign( startPos ) );

				if ( JUSTIFICATION === 'center' ) offset /= 2;

				this.children.forEach( ( child ) => {

					if ( !child.isBoxComponent ) return;

					this.childrenPos[ child.id ].x -= offset;

				} );

			}

		}

		/** Set children Y position according to this component dimension and attributes */
		setChildrenYPos( startPos ) {

			const JUSTIFICATION = this.getJustifyContent();

			this.children.reduce( ( accu, child ) => {

				if ( !child.isBoxComponent ) return accu;

				const CHILD_ID = child.id;
				const CHILD_HEIGHT = child.getHeight();
				let CHILD_MARGIN = 0;
				let CHILD_MARGIN_END = 0;
				if(child.margin === undefined) child.margin = [0 ,0 ,0 ,0];
				switch (JUSTIFICATION) {
					case "center":
						CHILD_MARGIN = child.margin[0];
						CHILD_MARGIN_END = child.margin[2];
						break;
					case "start":
						CHILD_MARGIN = child.margin[0];
						CHILD_MARGIN_END = child.margin[2];
						break;
					case "end":
						CHILD_MARGIN = child.margin[2];
						CHILD_MARGIN_END = child.margin[1];
						break;
				}

				accu += CHILD_MARGIN * -Math.sign( startPos );

				this.childrenPos[ CHILD_ID ] = {
					x: 0,
					y: accu + ( ( CHILD_HEIGHT / 2 ) * -Math.sign( startPos ) )
				};

				return accu + ( -Math.sign( startPos ) * ( CHILD_HEIGHT + CHILD_MARGIN_END ) );

			}, startPos );

			//

			if ( JUSTIFICATION === 'end' || JUSTIFICATION === 'center' ) {

				let offset = ( startPos * 2 ) - ( this.getChildrenSideSum( 'height' ) * Math.sign( startPos ) );

				if ( JUSTIFICATION === 'center' ) offset /= 2;

				this.children.forEach( ( child ) => {

					if ( !child.isBoxComponent ) return;

					this.childrenPos[ child.id ].y -= offset;

				} );

			}

		}

		/** called if justifyContent is 'column' or 'column-reverse', it align the content horizontally */
		alignChildrenOnX() {

			const ALIGNMENT = this.getAlignContent();

			if ( ALIGNMENT !== 'center' && ALIGNMENT !== 'right' && ALIGNMENT !== 'left' ) {
				console.warn( `alignContent === '${ALIGNMENT}' is not supported on this direction.` );
			}

			this.children.forEach( ( child ) => {
				if(child.margin === undefined) child.margin = [0 ,0 ,0 ,0];
				if(this.padding === undefined) this.padding = [0 ,0 ,0 ,0];
				if ( !child.isBoxComponent ) return;

				let offset;

				if ( ALIGNMENT === 'right' ) {
					const X_TARGET = ( this.getWidth() / 2 ) - ( this.padding[1] || 0 );
					offset = X_TARGET - ( child.getWidth() / 2 ) - ( child.margin[1] || 0 );

				} else if ( ALIGNMENT === 'left' ) {
					const X_TARGET = ( this.getWidth() / 2 ) - ( this.padding[3] || 0 );
					offset = -X_TARGET + ( child.getWidth() / 2 ) + ( child.margin[3] || 0 );

				}

				this.childrenPos[ child.id ].x = offset || 0;

			} );

		}

		/** called if justifyContent is 'row' or 'row-reverse', it align the content vertically */
		alignChildrenOnY() {

			const ALIGNMENT = this.getAlignContent();

			if ( ALIGNMENT !== 'center' && ALIGNMENT !== 'top' && ALIGNMENT !== 'bottom' ) {
				console.warn( `alignContent === '${ALIGNMENT}' is not supported on this direction.` );
			}

			this.children.forEach( ( child ) => {
				if(child.margin === undefined) child.margin = [0 ,0 ,0 ,0];
				if(this.padding === undefined) this.padding = [0 ,0 ,0 ,0];
				if ( !child.isBoxComponent ) return;

				let offset;

				if ( ALIGNMENT === 'top' ) {
					const Y_TARGET = ( this.getHeight() / 2 ) - ( this.padding[0] || 0 );
					offset = Y_TARGET - ( child.getHeight() / 2 ) - ( child.margin[0] || 0 );

				} else if ( ALIGNMENT === 'bottom' ) {
					const Y_TARGET = ( this.getHeight() / 2 ) - ( this.padding[2] || 0 );
					offset = -Y_TARGET + ( child.getHeight() / 2 ) + ( child.margin[2] || 0 );

				}

				this.childrenPos[ child.id ].y = offset || 0;

			} );

		}

		/**
		 * Returns the highest linear dimension among all the children of the passed component
		 * MARGIN INCLUDED
		 */
		getHighestChildSizeOn( direction ) {

			return this.children.reduce( ( accu, child ) => {
				if(child.margin === undefined) child.margin = [0 ,0 ,0 ,0];
				if ( !child.isBoxComponent ) return accu;

				const maxSize = direction === 'width' ?
					child.getWidth() + ( child.margin[1] + child.margin[3] ) :
					child.getHeight() + ( child.margin[0] + child.margin[2] );

				return Math.max( accu, maxSize );

			}, 0 );

		}

		/**
		 * Get width of this element
		 * With padding, without margin
		 */
		getWidth() {
			if(this.padding === undefined) this.padding = [0 ,0 ,0 ,0];
			return this.width || this.getInnerWidth() + ( this.padding[1] + this.padding[3]);

		}

		/**
		 * Get height of this element
		 * With padding, without margin
		 */
		getHeight() {
			if(this.padding === undefined) this.padding = [0 ,0 ,0 ,0];
			return this.height || this.getInnerHeight() + ( this.padding[0] + this.padding[2]);

		}

	};

}
