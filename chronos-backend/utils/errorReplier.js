module.exports =  function errorReplier(error, replyEntity) {
    switch(error.errCode){
        case 1001:
            replyEntity.status(400);
            break;
        default:
            replyEntity.status(500);
            break;
    }
    replyEntity.send(error);
}
