const COLUMN_FIELDS = {
  MySQL: [
    { title: 'Field', dataIndex: 'Field', width: 200 },
    { title: 'Type', dataIndex: 'Type', width: 90 },
    { title: 'Key', dataIndex: 'Key', width: 40 },
    { title: 'Null', dataIndex: 'Null', width: 40 },
    { title: 'Extra', dataIndex: 'Extra' },
    { title: '默认', dataIndex: 'Default' },
    { title: '权限', dataIndex: 'Privileges' },
    { title: '字符集', dataIndex: 'Collation' },
    { title: '注释', dataIndex: 'Comment' },
  ],
  PgSQL: [
    { title: 'Field', dataIndex: 'field', width: 60 },
    { title: 'Type', dataIndex: 'type', width: 60 },
    { title: 'Attnum', dataIndex: 'attnum', width: 60 },
    { title: 'Length', dataIndex: 'length', width: 60 },
    { title: 'LengthVar', dataIndex: 'lengthvar', width: 60 },
    { title: 'NotNull', dataIndex: 'notnull', width: 60 },
    { title: 'Comment', dataIndex: 'comment', width: 300 },
  ]
}

const COLUMN_INDEXES = {
  MySQL: [
    { title: 'ColumnName', dataIndex: 'ColumnName', width: 200 },
    { title: 'IndexType', dataIndex: 'IndexType' },
    { title: 'KeyName', dataIndex: 'KeyName' },
    { title: 'NonUnique', dataIndex: 'NonUnique' },
    { title: 'SeqInIndex', dataIndex: 'SeqInIndex' },
    { title: 'Table', dataIndex: 'Table' },
    { title: 'level', dataIndex: 'level' },
    { title: 'uid', dataIndex: 'uid' },
  ],
  MongoDB: [
    { title: 'Key', dataIndex: 'Key' },
    { title: 'Name', dataIndex: 'Name' },
    { title: 'Bits', dataIndex: 'Bits' },
    { title: 'Background', dataIndex: 'Background' },
    { title: 'BucketSize', dataIndex: 'BucketSize' },
    { title: 'Collation', dataIndex: 'Collation' },
    { title: 'DefaultLanguage', dataIndex: 'DefaultLanguage' },
    { title: 'DropDups', dataIndex: 'DropDups' },
    { title: 'ExpireAfter', dataIndex: 'ExpireAfter' },
    { title: 'LanguageOverride', dataIndex: 'LanguageOverride' },
    { title: 'Max', dataIndex: 'Max' },
    { title: 'Maxf', dataIndex: 'Maxf' },
    { title: 'Min', dataIndex: 'Min' },
    { title: 'Minf', dataIndex: 'Minf' },
    { title: 'Sparse', dataIndex: 'Sparse' },
    { title: 'Unique', dataIndex: 'Unique' },
    { title: 'Weights', dataIndex: 'Weights' },
  ],
  PgSQL: [
    { title: 'indexdef', dataIndex: 'indexdef' },
    { title: 'indexname', dataIndex: 'indexname' },
    { title: 'schemaname', dataIndex: 'schemaname' },
    { title: 'tablename', dataIndex: 'tablename' },
    { title: 'tablespace', dataIndex: 'tablespace' },
  ]
}

export {
  COLUMN_FIELDS,
  COLUMN_INDEXES
}
