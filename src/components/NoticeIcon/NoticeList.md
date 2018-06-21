NoticeList component example:

```jsx
const Tag = require('antd').Tag;
const groupBy = require('lodash/groupBy');
const moment = require('moment');

const data = [
  {
    id: '000000009',
    title: 'Task 1',
    description: 'Task 1 description',
    extra: 'To do',
    status: 'todo',
    type: 'todo'
  },
  {
    id: '000000010',
    title: 'Task 2',
    description: 'Task 2 description',
    extra: 'Expired',
    status: 'urgent',
    type: 'todo'
  },
  {
    id: '000000011',
    title: 'Task 3',
    description: 'Task 3 description',
    extra: 'Expire soon',
    status: 'doing',
    type: 'todo'
  },
  {
    id: '000000012',
    title: 'Task 4',
    description: 'Task 4 description',
    extra: 'Doing',
    status: 'processing',
    type: 'todo'
  }
];

function getNoticeData(notices) {
  if (notices.length === 0) {
    return {};
  }
  const newNotices = notices.map(notice => {
    const newNotice = { ...notice };
    if (newNotice.datetime) {
      newNotice.datetime = moment(notice.datetime).fromNow();
    }
    // transform id to item key
    if (newNotice.id) {
      newNotice.key = newNotice.id;
    }
    if (newNotice.extra && newNotice.status) {
      const color = {
        todo: '',
        processing: 'blue',
        urgent: 'red',
        doing: 'gold'
      }[newNotice.status];
      newNotice.extra = (
        <Tag color={color} style={{ marginRight: 0 }}>
          {newNotice.extra}
        </Tag>
      );
    }
    return newNotice;
  });
  return groupBy(newNotices, 'type');
}

const noticeData = getNoticeData(data);

<NoticeList
  data={noticeData.todo}
  onClick={() => {}}
  onClear={() => {}}
  title="Todo"
/>;
```
