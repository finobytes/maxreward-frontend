export const tree = {
  success: true,
  message: "Member tree with structure retrieved successfully",
  data: {
    root_member: {
      id: 1,
      name: "Ahmad bin Abdullah",
      user_name: "0123456789",
      referral_code: "YPJRABSV",
    },
    statistics: {
      total_members: 30,
      deepest_level: 5,
      left_leg_count: 10,
      right_leg_count: 20,
    },
    tree_structure: [
      {
        level: 1,
        node_count: 1,
        nodes: [
          {
            parent: {
              id: 1,
              name: "Ahmad bin Abdullah",
            },
            left_child: {
              id: 34,
              name: "Rakib Ahmed",
              position: "left",
            },
            right_child: {
              id: 35,
              name: "Rahman Habib",
              position: "right",
            },
          },
        ],
      },
      {
        level: 2,
        node_count: 2,
        nodes: [
          {
            parent: {
              id: 34,
              name: "Rakib Ahmed",
            },
            left_child: {
              id: 36,
              name: "Sumon Ahmed",
              position: "left",
            },
            right_child: {
              id: 38,
              name: "Ishpahan Ahmed",
              position: "right",
            },
          },
          {
            parent: {
              id: 35,
              name: "Rahman Habib",
            },
            left_child: {
              id: 37,
              name: "Akash Ahmed",
              position: "left",
            },
            right_child: {
              id: 39,
              name: "Rakhal Ahmed",
              position: "right",
            },
          },
        ],
      },
      {
        level: 3,
        node_count: 4,
        nodes: [
          {
            parent: {
              id: 36,
              name: "Sumon Ahmed",
            },
            left_child: {
              id: 40,
              name: "Kazol Ahmed",
              position: "left",
            },
            right_child: {
              id: 55,
              name: "Rajjakl Ahmed",
              position: "right",
            },
          },
          {
            parent: {
              id: 38,
              name: "Ishpahan Ahmed",
            },
            left_child: {
              id: 54,
              name: "Ali Ahmed",
              position: "left",
            },
            right_child: {
              id: 56,
              name: "Karim Ahmed",
              position: "right",
            },
          },
          {
            parent: {
              id: 37,
              name: "Akash Ahmed",
            },
            left_child: {
              id: 41,
              name: "Sumon Ahmed",
              position: "left",
            },
            right_child: {
              id: 43,
              name: "Iyasin Ahmed",
              position: "right",
            },
          },
          {
            parent: {
              id: 39,
              name: "Rakhal Ahmed",
            },
            left_child: {
              id: 42,
              name: "Mahfuz Ahmed",
              position: "left",
            },
            right_child: {
              id: 44,
              name: "Masud Ahmed",
              position: "right",
            },
          },
        ],
      },
      {
        level: 4,
        node_count: 8,
        nodes: [
          {
            parent: {
              id: 40,
              name: "Kazol Ahmed",
            },
            left_child: {
              id: 58,
              name: "Sheba Ahmed",
              position: "left",
            },
            right_child: {
              id: 59,
              name: "Sheba xyz",
              position: "right",
            },
          },
          {
            parent: {
              id: 55,
              name: "Rajjakl Ahmed",
            },
            left_child: {
              id: 63,
              name: "Anik Ahmed",
              position: "left",
            },
            right_child: null,
          },
          {
            parent: {
              id: 54,
              name: "Ali Ahmed",
            },
            left_child: null,
            right_child: null,
          },
          {
            parent: {
              id: 56,
              name: "Karim Ahmed",
            },
            left_child: null,
            right_child: null,
          },
          {
            parent: {
              id: 41,
              name: "Sumon Ahmed",
            },
            left_child: {
              id: 45,
              name: "Ahdgdg Ahmed",
              position: "left",
            },
            right_child: {
              id: 49,
              name: "rdfdds Ahmed",
              position: "right",
            },
          },
          {
            parent: {
              id: 43,
              name: "Iyasin Ahmed",
            },
            left_child: {
              id: 46,
              name: "ksgdg Ahmed",
              position: "left",
            },
            right_child: {
              id: 50,
              name: "oiedr Ahmed",
              position: "right",
            },
          },
          {
            parent: {
              id: 42,
              name: "Mahfuz Ahmed",
            },
            left_child: {
              id: 47,
              name: "liysdfdwsg Ahmed",
              position: "left",
            },
            right_child: {
              id: 51,
              name: "Anus Ahmed",
              position: "right",
            },
          },
          {
            parent: {
              id: 44,
              name: "Masud Ahmed",
            },
            left_child: {
              id: 48,
              name: "avdfd Ahmed",
              position: "left",
            },
            right_child: {
              id: 52,
              name: "Yunus Ahmed",
              position: "right",
            },
          },
        ],
      },
      {
        level: 5,
        node_count: 11,
        nodes: [
          {
            parent: {
              id: 58,
              name: "Sheba Ahmed",
            },
            left_child: null,
            right_child: null,
          },
          {
            parent: {
              id: 59,
              name: "Sheba xyz",
            },
            left_child: null,
            right_child: null,
          },
          {
            parent: {
              id: 63,
              name: "Anik Ahmed",
            },
            left_child: null,
            right_child: null,
          },
          {
            parent: {
              id: 45,
              name: "Ahdgdg Ahmed",
            },
            left_child: {
              id: 53,
              name: "Qayum Ahmed",
              position: "left",
            },
            right_child: {
              id: 60,
              name: "Sheba Ahmed",
              position: "right",
            },
          },
          {
            parent: {
              id: 49,
              name: "rdfdds Ahmed",
            },
            left_child: {
              id: 57,
              name: "Kamran Ahmed",
              position: "left",
            },
            right_child: {
              id: 61,
              name: "Wasim Ahmed",
              position: "right",
            },
          },
          {
            parent: {
              id: 46,
              name: "ksgdg Ahmed",
            },
            left_child: null,
            right_child: null,
          },
          {
            parent: {
              id: 50,
              name: "oiedr Ahmed",
            },
            left_child: null,
            right_child: null,
          },
          {
            parent: {
              id: 47,
              name: "liysdfdwsg Ahmed",
            },
            left_child: {
              id: 62,
              name: "Mahedi Ahmed",
              position: "left",
            },
            right_child: null,
          },
          {
            parent: {
              id: 51,
              name: "Anus Ahmed",
            },
            left_child: null,
            right_child: null,
          },
          {
            parent: {
              id: 48,
              name: "avdfd Ahmed",
            },
            left_child: null,
            right_child: null,
          },
          {
            parent: {
              id: 52,
              name: "Yunus Ahmed",
            },
            left_child: null,
            right_child: null,
          },
        ],
      },
      {
        level: 6,
        node_count: 5,
        nodes: [
          {
            parent: {
              id: 53,
              name: "Qayum Ahmed",
            },
            left_child: null,
            right_child: null,
          },
          {
            parent: {
              id: 60,
              name: "Sheba Ahmed",
            },
            left_child: null,
            right_child: null,
          },
          {
            parent: {
              id: 57,
              name: "Kamran Ahmed",
            },
            left_child: null,
            right_child: null,
          },
          {
            parent: {
              id: 61,
              name: "Wasim Ahmed",
            },
            left_child: null,
            right_child: null,
          },
          {
            parent: {
              id: 62,
              name: "Mahedi Ahmed",
            },
            left_child: null,
            right_child: null,
          },
        ],
      },
    ],
  },
};
