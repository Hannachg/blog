var mongodb = require('./db');


function Post(name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post;
}

module.exports = Post;

//�洢����
Post.prototype.save = function (callback) {
    var date = new Date();
    var time =
    {
        date: (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()).toString()
    }
    //�������ݿ���ĵ�
    var post = {
        name: this.name,
        time: time.date,
        title: this.title,
        post: this.post,
        comments: []

    }
    //�����ݿ�
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }
        //��ȡ���ݿ�
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //���뼯��
            collection.insert(post, {
                safe: true
            }, function (err, post) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });


    });
}
Post.getTen = function (name, page, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            //ʹ�� count �����ض���ѯ���ĵ��� total
            collection.count(query, function (err, total) {
                //���� query �����ѯ��������ǰ (page-1)*10 �����������֮��� 10 �����
                collection.find(query, {
                    skip: (page - 1) * 10,
                    limit: 10
                }).sort({
                    time: -1
                }).toArray(function (err, docs) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, docs, total);
                });
            })
        })
    })
}

Post.getOne = function (name, time, title, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                'name': name,
                'time': time,
                'title': title
            }, function (err, doc) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, doc);
            })
        })
    })
}

Post.edit = function (name, time, title, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                'name': name,
                'time': time,
                'title': title
            }, function (err, doc) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, doc);
            })
        })
    })
}
Post.update = function (name, time, title, post, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.update({
                'name': name,
                'time': time,
                'title': title
            }, {
                $set: {post: post}
            }, function (err) {

                mongodb.close();
                if (err) {
                    console.log(111);
                    return callback(err);
                }
                callback(null);
            })
        })
    })
}

Post.remove = function (name, time, title, callback) {
    //�����ݿ�
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //��ȡ posts ����
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //�����û��������ںͱ�����Ҳ�ɾ��һƪ����
            collection.remove({
                "name": name,
                "time": time,
                "title": title
            }, {
                w: 1
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};
Post.search = function(keyword, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var pattern = new RegExp(keyword, "i");
            collection.find({
                "title": pattern
            }, {
                "name": 1,
                "time": 1,
                "title": 1
            }).sort({
                time: -1
            }).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
};