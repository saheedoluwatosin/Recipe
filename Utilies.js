



const pagination = (request)=>{
    const page = Number(request.query.page) || 1
    const limit = request.query.limit || 5
    const skip = limit * (page - 1)
    return {page,limit,skip}
}


module.exports = pagination

