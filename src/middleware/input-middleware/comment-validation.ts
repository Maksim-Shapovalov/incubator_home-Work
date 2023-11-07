import {body} from "express-validator";

export const CommentValidation = ()=>(
    [
        body('content')
            .trim()
            .isString()
            .isLength({min:20,max:300})
            .notEmpty()
            .withMessage('Invalid content'),

    ]
)