module.exports =  function errorReplier(error, replyEntity) {
    switch(error.errCode){
        case 1001:
        case 1002:
        case 1004:
        case 1005:
        case 1007:
        case 1008:
        case 1014:
        case 1016:
        case 1017:
        case 1021:
        case 1022:
        case 1023:
        case 1024:
        case 1025:
        case 1036:
            replyEntity.status(400);
            break;
        case 1006:
            replyEntity.status(401);
            break;
        case 1003:
        case 1009:
        case 1012:
        case 1013:
        case 1015:
        case 1031:
        case 1032:
        case 1033:
        case 1034:
        case 1035:
            replyEntity.status(403);
            break;
        case 1011:
            replyEntity.status(405);
            break;  
        default:
            replyEntity.status(500);
            break;
    }
    replyEntity.send(error);
}
