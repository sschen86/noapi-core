import { config, run, exec } from './database'
import fs from 'fs-extra'
import md5 from 'md5'

const DB_PATH = './database/data2.db'

config({ DB_PATH })

install()
    .then(() => {
        console.warn('安装成功...')
    })
    .catch((err) => {
        console.warn(err.message)
    })

async function install () {
    const dbFile = await fs.exists(DB_PATH)
    if (dbFile) {
        throw Error('跳过安装')
    }

    await fs.ensureFile(DB_PATH)
    await createUserTable()
    console.warn('用户表创建成功')
    await createProjectTable()
    console.warn('项目表创建成功')
    await createProjectFavorateTable()
    console.warn('项目关注表创建成功')
    await createCategoryTable()
    console.warn('分类表创建成功')
    await createApiTable()
    console.warn('接口表创建成功')
    await createApiHistoryTable()
    console.warn('接口历史表创建成功')
    await createAdminAccount()
    console.warn('管理员账号创建成功')
}

async function createUserTable () {
    return exec(`
        CREATE TABLE user (
            id      INTEGER          PRIMARY KEY    AUTOINCREMENT  NOT NULL,
            name    CHAR(64)                    NOT NULL UNIQUE,
            nick    CHAR(64)                        NOT NULL UNIQUE,
            password    CHAR(32)                    NOT NULL,
            avatar   CHAR(64)    ,
            createTime  TIMESTAMP       DEFAULT (datetime('now', 'localtime')),
            lastLoginTime INTEGER           ,
            lastLoginIp     CHAR(16)        ,
            role           INTEGER      DEFAULT 0 --  0:VIEWER 1:DEVELOPER 2:ADMIN --                  
        )
    `)
}

async function createProjectTable () {
    return exec(`
        CREATE TABLE project (
            id      INTEGER          PRIMARY KEY    AUTOINCREMENT  NOT NULL,
            name    CHAR(64)                    NOT NULL,
            avatar   CHAR(64)    ,
            description   CHAR(128) ,
            createTime      INTEGER NOT NULL
        )
    `)
}

async function createProjectFavorateTable () {
    return exec(`
        CREATE TABLE projectFavorite (
            id      INTEGER             PRIMARY KEY    AUTOINCREMENT  NOT NULL,
            projectId   INTEGER         NOT NULL,
            userId      INTEGER,
            UNIQUE ('projectId', 'userId')
        )
    `)
}

async function createCategoryTable () {
    return exec(`
        CREATE TABLE category (
            id      INTEGER             PRIMARY KEY    AUTOINCREMENT  NOT NULL,
            name    CHAR(64)            NOT NULL,
            projectId   INTEGER         NOT NULL,
            parentId    INTEGER,
            prevId      INTEGER,
            nextId      INTEGER,
            createTime  TIMESTAMP       DEFAULT (datetime('now', 'localtime'))
        )
    `)
}

async function createApiTable () {
    return exec(`
        CREATE TABLE api (
            id      INTEGER                     PRIMARY KEY    AUTOINCREMENT  NOT NULL,
            name    CHAR(64)                    NOT NULL,
            method  INTEGER                     DEFAULT 0, --  0:GET, 1:POST 2:PUT 3:DELETE 4:OPTION --
            path    CHAR(256)                   NOT NULL UNIQUE,
            reqDataFormat  INTEGER              DEFAULT 0, --  0,1,2--
            reqData   CHAR         ,
            resData    CHAR,
            projectId  INTEGER                  NOT NULL,
            categoryId  INTEGER,
            prevId      INTEGER,
            nextId      INTEGER,
            description CHAR(256),
            createTime  TIMESTAMP       NOT NULL DEFAULT (datetime('now', 'localtime'))
        )
    `)
    // reqDataFormat. 0:application/json
    // reqDataFormat. 1:application/x-www-form-urlencoded
    // reqDataFormat. 2:multipart/form-data
}

async function createApiHistoryTable () {
    return exec(`
        CREATE TABLE apiHistory (
            id      INTEGER                     PRIMARY KEY    AUTOINCREMENT  NOT NULL,
            type    INTEGER                     DEFAULT 0, --  0:UPDATE, 1:UPDATE --
            description    CHAR(128)            NOT NULL,
            author         CHAR(64)              ,
            time      INTEGER              NOT NULL,
            apiId       INTEGER              NOT NULL
        )
    `)
}

async function createAdminAccount () {
    return run(`
        INSERT INTO user(name, nick, password, createTime,role)
        VALUES ('admin', '超级管理员', '${md5('123456')}', ${Date.now()}, 2)
    `)
}
/*
user {
    id
    name
    password
    avatar
    createTime
    lastLoginTime
    lastLoginIp
    role admin | developer | viewer
}

project{
    id
    name
    description
    createTime
    avatar
}

project-favorate {
    id
    projectId
    userId
}

category{
    id
    name
    parentId
    projectId
}

api{
    id
    name
    path
    method
    reqDataFormat
    reqData
    resData
}

api-history{
    id
    type
    description
    author
    time
    apiId
}


*/
