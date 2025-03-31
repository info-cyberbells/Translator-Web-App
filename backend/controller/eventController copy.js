import Event from '../model/eventModel.js';

export const addEvent = async (req, res) => {
  try {
    const { name, date, description } = req.body;

    // Check if the Event already exists
    const existingEvent = await Event.findOne({ name });
    if (existingEvent) {
      return res.status(400).json({ error: 'Event already exists' });
    }

    const newEvent = new Event({
      name,
      date,
      description
     
    });

    // Save the Event to the database
    await newEvent.save();

    const EventWithoutPassword = {
      _id: newEvent._id,
      name: newEvent.name,
      date: newEvent.date,
      description: newEvent.description

  
      
  };
    res.status(201).json({ message: 'Event is saved successfully', Event: EventWithoutPassword });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const fetchAllEvent = async (req, res) => {
    try {
      const Eventes = await Event.find(); // Fetch all Eventes
      res.status(200).json(Eventes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  // Add this function to your Event controller
export const countAllEvents = async (req, res) => {
  try {
    const count = await Event.countDocuments(); // Count all Eventes
    res.status(200).json({ total: count }); // Return the total count in the response
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
};



  export const fetchEventType= async (req, res) => {
    try {
        const eventType = req.params.type; 
        const events = await Event.find({ type: eventType }); 
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };
  

  
  export const detailEvent = async (req, res) => {
    try {
      const { id } = req.params;
      console.log("id", id);
      const eventDetail = await Event.findById(id); // Fetch Event by ID
      if (!eventDetail) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      res.status(200).json(eventDetail);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  
  export const updateEvent = async (req, res) => {
    try {
      const { id } = req.params;
      const updateFields = req.body;
  
      const updatedEvent = await Event.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
  
      if (!updatedEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      res.status(200).json({ message: 'Event is updated successfully', Event: updatedEvent });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


  // Delete Event by ID
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event is deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

  
